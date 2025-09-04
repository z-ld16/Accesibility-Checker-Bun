import { MongoClient } from 'mongodb'
import consola from 'consola'

function workerDbName(prefix = 'db_test') {
  return `${prefix}_${process.pid}`
}

export async function mockDB() {
  const mongoURI = process.env.MONGO_URI

  if (!mongoURI) {
    throw new Error('No test mongo uri available')
  }

  const dbName = workerDbName()

  process.env.DB_NAME = dbName

  const client = new MongoClient(mongoURI)

  await client.connect()
  consola.log('Connected successfully to MongoDB')

  const db = client.db(dbName)
  return {
    db,
    dispose: async () => {
      db.dropDatabase()
    },
  }
}
