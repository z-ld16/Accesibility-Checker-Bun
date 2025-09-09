import { MongoClient } from 'mongodb'
import consola from 'consola'

import { loadEnv } from '../../config/environment-variables'

export async function mongoConnect() {
  const { MONGO_URI, DB_NAME } = loadEnv()
  const client = new MongoClient(MONGO_URI)
  try {
    await client.connect()
    consola.log('Connected successfully to MongoDB')

    return client.db(DB_NAME)
  } catch (err) {
    consola.error('MongoDB connection error:', err)
    throw err
  }
}
