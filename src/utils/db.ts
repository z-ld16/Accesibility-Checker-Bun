import { mongoConnect } from '../services/db/mongo-connect'

export async function getCollection<T extends Document = Document>(
  collectionName: string,
) {
  const db = await mongoConnect()

  const collection = db.collection<T>(collectionName)

  return collection
}
