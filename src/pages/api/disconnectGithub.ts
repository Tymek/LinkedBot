import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ObjectId } from 'mongodb'
import connectToDatabase from 'utils/mongodb'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405)
    res.json({ error: 'Method Not Allowed' })

    return
  }

  const session = await getSession({ req })

  if (!session?.user?.id) {
    res.status(401)
    res.json({ error: 'Unauthorized' })

    return
  }

  const userId = new ObjectId(session.user.id)

  try {
    const { db } = await connectToDatabase()
    const response = await db.collection('accounts').deleteOne({
      userId,
      providerId: 'github',
    })

    res.json({ response })
  } catch (error) {
    res.status(500)
    console.log(error) // eslint-disable-line no-console

    res.json({ error: 'Internal Server Error' })
  }
}

export default handler
