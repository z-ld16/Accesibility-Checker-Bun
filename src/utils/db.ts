import { mongoConnect } from '../services/db/mongo-connect'
import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from './errors.utils'

export async function getCollection<T extends Document = Document>(
  collectionName: string,
) {
  const db = await mongoConnect()

  if (!db) {
    throwError(APPLICATION_ERRORS.GENERIC.DB_ERROR)
  }

  const collection = db.collection<T>(collectionName)

  return collection
}
