import { Db, MongoClient } from 'mongodb'

const { MONGODB_URI } = process.env
const { MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable')
}

type CustomGlobal = typeof global & {
  mongo?: {
    db: Db
    client: MongoClient
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as CustomGlobal).mongo

async function connectToDatabase(): Promise<CustomGlobal['mongo']> {
  if (!cached) {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    cached = {
      client,
      db: client.db(MONGODB_DB),
    }
  }

  return cached
}

export default connectToDatabase
