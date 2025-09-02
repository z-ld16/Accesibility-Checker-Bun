import { DBConnectionFailedError } from '../errors/db.errors'
import { mongoConnect } from '../services/db/mongo-connect'

export async function getCollection<T extends Document = Document>(
  collectionName: string,
) {
  const db = await mongoConnect()

  if (!db) {
    throw new DBConnectionFailedError()
  }

  const collection = db.collection<T>(collectionName)

  return collection
}
