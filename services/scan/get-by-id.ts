import type { ObjectId } from 'mongodb'

import { NotFoundError } from '../../errors/http.errors'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function getScanByIdService(id: ObjectId) {
  const scans = await getCollection(COLLECTIONS.SCANS)
  const scan = await scans.findOne({ _id: id })
  if (!scan) {
    throw new NotFoundError()
  }

  return scan
}
