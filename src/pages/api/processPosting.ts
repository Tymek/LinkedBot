/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import githubApiFetcher from 'utils/githubApiFetcher'
import connectToDatabase from 'utils/mongodb'
import template from 'utils/template'
import { Activity, GithubRepoDetails } from 'utils/types'

// const apiPostingUrl = 'http://localhost:3000/api/echo'
const apiPostingUrl = 'https://api.linkedin.com/v2/ugcPosts'

const getRepoDetails = (
  name: string,
  token: string,
): Promise<GithubRepoDetails> =>
  githubApiFetcher(`https://api.github.com/repos/${name}`, token)

const createPost = async (
  authorId: string | number,
  accessToken: string,
  text: string,
): Promise<Response> => {
  const body = {
    author: `urn:li:person:${authorId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text,
        },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  return fetch(apiPostingUrl, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'text/json',
      'X-Restli-Protocol-Version': '2.0.0',
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

// TODO: refactor - processEvents has the same structure
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const start = new Date()
  const data = []
  const log = (message: string | number | Record<string, number | string>) => {
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
    let counter = 0
    const activities = db.collection<Activity>('activity')
    for await (const activity of activities.find({
      published: false,
    })) {
      counter += 1
      log(`processing activity ${counter}: ${activity._id}`)
      const repoDetails = await getRepoDetails(
        activity.repo,
        activity.githubToken,
      )

      const {
        watchers_count: watchers,
        stargazers_count: stars,
        forks_count: forks,
      } = repoDetails

      await activities.updateOne(
        {
          _id: new ObjectId(activity._id),
        },
        {
          $set: { watchers, stars, forks, published: true },
        },
      )

      //= == === PUBLISH
      const text = template({
        user: activity.user,
        name: activity.repo,
        watchers,
        stars,
        forks,
      })

      const apiResponse = await createPost(
        activity.linkedinId,
        activity.linkedinToken,
        text,
      )

      if (apiResponse.status >= 300) {
        log(`  error`)
        await activities.updateOne(
          {
            _id: new ObjectId(activity._id), // eslint-disable-line no-underscore-dangle
          },
          {
            $set: {
              error: {
                status: apiResponse.status,
                response: await apiResponse.json(),
              },
            },
          },
        )
      }
    }

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
