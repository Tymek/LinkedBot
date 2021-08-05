/* eslint-disable no-underscore-dangle */
import { NextApiRequest, NextApiResponse } from 'next'
import { isBefore, parseISO } from 'date-fns'
import { ObjectId } from 'mongodb'
import { Account, Activity, GithubEvent, GithubUserData } from 'utils/types'
import connectToDatabase from 'utils/mongodb'

import githubApiFetcher from '../../utils/githubApiFetcher'

const getLoginInfo = async (account: Account): Promise<[string, Date]> => {
  if (account?.login) {
    return [account?.login, account?.lastActivityPublishedAt]
  }

  // update from GitHub API
  const response = await githubApiFetcher<GithubUserData>(
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

  return [login, lastActivityPublishedAt]
}

const filterStarsActivity = (event: GithubEvent) =>
  event.type === 'WatchEvent' && event.payload.action === 'started'

const getActivity = (id: string, token: string): Promise<GithubEvent[]> =>
  githubApiFetcher(
    `https://api.github.com/users/${id}/events/public?per_page=100`,
    token,
  )

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const start = new Date()
  const data = []
  const log = (message: string) => {
    data.push(message)
  }

  try {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      log('Unauthorized')
      throw new Error('403')
    }
    const { db } = await connectToDatabase()
    log(`timestamp: ${start.toISOString()}`)

    /*= MAIN ===== */

    const newActivity: Activity[] = []
    let accountCounter = 0

    const accounts = db.collection<Account>('accounts')

    for await (const githubAccount of accounts.find({
      providerId: 'github',
    })) {
      accountCounter += 1
      log(`processing account ${accountCounter}: ${githubAccount._id}`)
      try {
        const [login, lastActivityPublishedAt] = await getLoginInfo(
          githubAccount,
        )
        const linkedinAccount = await accounts.findOne({
          userId: { $eq: new ObjectId(githubAccount.userId) },
          providerId: { $eq: 'linkedin' },
        })

        if (
          !linkedinAccount?.providerAccountId ||
          !linkedinAccount?.accessToken
        ) {
          throw new Error('LinkedIn account not found')
        }

        const events = await getActivity(login, githubAccount.accessToken)
        const starsActivity = events.filter(filterStarsActivity)

        const mappedActivity = starsActivity.map(activity => ({
          id: activity.id,
          accountId: new ObjectId(githubAccount._id),
          user: activity.actor.login,
          repo: activity.repo.name,
          githubToken: githubAccount.accessToken,
          created_at: activity.created_at,
          linkedinToken: linkedinAccount.accessToken,
          linkedinId: linkedinAccount.providerAccountId,
          published:
            isBefore(parseISO(activity.created_at), lastActivityPublishedAt) &&
            undefined,
        }))

        await db.collection('accounts').updateOne(
          {
            _id: new ObjectId(githubAccount._id),
          },
          {
            $set: {
              lastActivityPublishedAt: new Date(),
            },
          },
        )
        newActivity.push(...mappedActivity)
        log(
          `  ${
            mappedActivity.filter(activity => activity.published === false)
              .length
          } new events queued`,
        )
      } catch (error) {
        log(error)
      }
    }

    const collection = db.collection<Activity>('activity')
    collection.createIndex({ id: 1 }, { unique: true })
    await collection.insertMany(newActivity).catch(() => {
      // console.log(error) // eslint-disable-line no-console
    })

    /*= END MAIN ===== */
    const end = new Date()
    log(`timestamp: ${end.toISOString()}`)
    log(`duration: ${(end.getTime() - start.getTime()) / 1000}s`)
    res.json({ log: data })
  } catch (error) {
    res.status(500)
    console.log(error) // eslint-disable-line no-console

    res.json({ error: 'Internal Server Error', log: data })
  }
}

export default handler
