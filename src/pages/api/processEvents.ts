/* eslint-disable no-underscore-dangle */
import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from 'utils/mongodb'
import { Account, GithubEvent, GithubUserData } from 'utils/types'
import { ObjectId } from 'mongodb'

const githubApi = async <T = Record<string, unknown>>(url, token): Promise<T> =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())

const getLoginInfo = async (account: Account): Promise<[string, string]> => {
  if (account?.login) {
    return [account?.login, account?.lastActivityPublishedAt]
  }

  // update from GitHub API
  const response = await githubApi<GithubUserData>(
    `https://api.github.com/user/${account.providerAccountId}`,
    account.accessToken,
  )

  const { login } = response
  const lastActivityPublishedAt = new Date()

  // Save to database
  const { db } = await connectToDatabase()
  await db.collection('accounts').updateOne(
    {
      _id: new ObjectId(account._id),
    },
    {
      $set: {
        login,
        lastActivityPublishedAt,
      },
    },
  )

  return [login, lastActivityPublishedAt.toISOString()]
}

const filterStarsActivity = (event: GithubEvent) =>
  event.type === 'WatchEvent' && event.payload.action === 'started'

const getActivity = (id, token): Promise<GithubEvent[]> =>
  fetch(`https://api.github.com/users/${id}/events/public?per_page=100`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(data => data.json())

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  // TODO: verify access?
  const data = []
  const log = (message: string) => {
    data.push(message)
    // console.log(message)
  }
  try {
    const { db } = await connectToDatabase()
    const now = new Date()
    log(`Current timestamp: ${now.toISOString()}`)

    const processAccount = async (account: Account) => {
      const [login] = await getLoginInfo(account)
      const activity = await getActivity(login, account.accessToken)
      const starsActivity = activity.filter(filterStarsActivity)
      data.push(starsActivity)
      // console.log({ length: starsActivity.length, lastUpdate })
      log(`Account ${account?._id}`)
    }

    for await (const account of db.collection<Account>('accounts').find({
      providerId: 'github',
    })) {
      await processAccount(account)
    }

    res.json({ data })
  } catch (error) {
    res.status(500)
    console.log(error) // eslint-disable-line no-console

    res.json({ error: 'Internal Server Error' })
  }
}

export default handler
