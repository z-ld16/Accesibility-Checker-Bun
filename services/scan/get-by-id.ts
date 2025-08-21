import type { ObjectId } from 'mongodb'

import { NotFoundError } from '../../errors/http.errors'
import { mongoConnect } from '../db/mongo-connect'

export async function getScanByIdService(id: ObjectId) {
  const db = await mongoConnect()

  const scans = db?.collection('scans')

  if (!scans) {
    throw new NotFoundError()
  }
  const scan = await scans.findOne({ _id: id })

  if (!scan) {
    throw new NotFoundError()
  }

  return scan
}
