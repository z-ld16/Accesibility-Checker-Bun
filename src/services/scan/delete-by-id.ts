import type { ObjectId } from 'mongodb'

import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function deleteScanByIdService(id: ObjectId) {
  const scans = await getCollection(COLLECTIONS.SCANS)

  return scans.deleteOne({ _id: id })
}
