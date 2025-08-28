import { DBConnectionFailedError } from '../errors/db.errors'
import { mongoConnect } from '../services/db/mongo-connect'

export async function getCollection(collectionName: string) {
  const db = await mongoConnect()

  if (!db) {
    throw new DBConnectionFailedError()
  }

  const collection = db.collection(collectionName)

  return collection
}
