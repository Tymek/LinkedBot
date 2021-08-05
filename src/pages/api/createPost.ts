import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import connectToDatabase from 'utils/mongodb'
import { Account } from 'utils/types'

const apiPostingUrl = 'https://api.linkedin.com/v2/ugcPosts'

const getLinkedinAccess = async (
  userId: string,
): Promise<{
  authorId: string | number
  accessToken: string
}> => {
  const { db } = await connectToDatabase()
  const account = await db.collection<Account>('accounts').findOne({
    userId: { $eq: new ObjectId(userId) },
    providerId: { $eq: 'linkedin' },
  })

  if (!account?.providerAccountId || !account?.accessToken) {
    throw new Error('LinkedIn account not found')
  }

  return {
    authorId: account?.providerAccountId,
    accessToken: account?.accessToken,
  }
}

const createPost = async (userId: string, text: string): Promise<Response> => {
  const { authorId, accessToken } = await getLinkedinAccess(userId)

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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req })
  if (!session?.user?.id) {
    res.status(401)
    res.json({ error: 'Unauthorized' })
  }

  try {
    const apiResponse = await createPost(
      session.user.id,
      'Test post using LinkedIn API.',
    )

    res.status(apiResponse.status)
    res.json(await apiResponse.json())
  } catch (error) {
    res.status(500)
    console.log(error) // eslint-disable-line no-console

    res.json({ error: 'Internal Server Error' })
  }
}

export default handler
