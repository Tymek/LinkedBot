import { Db, MongoClient } from 'mongodb'

const { MONGODB_URI } = process.env
const { MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local',
  )
}

type CustomGlobal = typeof global & {
  mongo: {
    conn: null | {
      client: MongoClient
      db: Db
    }
    promise: null | Promise<{
      client: MongoClient
      db: Db
    }>
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as CustomGlobal).mongo

if (!cached) {
  cached = (global as CustomGlobal).mongo
    ? (global as CustomGlobal).mongo
    : { conn: null, promise: null }
}

async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const cachedPromise = MongoClient.connect(MONGODB_URI, opts).then(
      client => {
        return {
          client,
          db: client.db(MONGODB_DB),
        }
      },
    )

    cached.promise = cachedPromise
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase
