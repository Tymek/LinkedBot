import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ObjectId } from 'mongodb'
import connectToDatabase from 'utils/mongodb'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getSession({ req })
  if (!session?.user?.id) {
    res.status(401)
    res.json({ error: 'Unauthorized' })

    return
  }

  const userId = ObjectId(session.user.id)

  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({
      _id: userId,
    })
    const accounts = await db
      .collection('accounts')
      .find({
        userId,
      })
      .toArray()

    res.json({ session, user, accounts })
  } catch (error) {
    res.status(500)
    console.log(error)
    res.json({ error: 'Internal Server Error' })
  }
}

export default handler
