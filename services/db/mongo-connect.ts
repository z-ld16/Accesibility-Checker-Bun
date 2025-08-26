import { MongoClient } from 'mongodb'
import consola from 'consola'

import { MONGO_URI, DB_NAME } from '../../config'

const client = new MongoClient(MONGO_URI)

export async function mongoConnect() {
  try {
    await client.connect()
    consola.log('Connected successfully to MongoDB')

    return client.db(DB_NAME)
  } catch (err) {
    consola.error('MongoDB connection error:', err)
  }
}
