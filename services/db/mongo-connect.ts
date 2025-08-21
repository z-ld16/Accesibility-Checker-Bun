import { MongoClient } from 'mongodb'
import consola from 'consola'

const client = new MongoClient('mongodb://localhost:27017/mydb')

export async function mongoConnect() {
  try {
    await client.connect()
    consola.log('Connected successfully to MongoDB')

    return client.db('mydb')
  } catch (err) {
    consola.error('MongoDB connection error:', err)
  }
}
