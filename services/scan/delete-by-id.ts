import type { ObjectId } from 'mongodb'

import { mongoConnect } from '../db/mongo-connect'

export async function deleteScanByIdService(id: ObjectId) {
  const db = await mongoConnect()

  const scans = db?.collection('scans')

  return scans?.deleteOne({ _id: id })
}
