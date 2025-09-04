import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export const getAllScansServices = async (limit: number, offset: number) => {
  const scans = await getCollection(COLLECTIONS.SCANS)
  const count = (await scans.countDocuments()) || 0
  const rawScans = await scans.find().skip(offset).limit(limit).toArray()
  return {
    scans: rawScans,
    count,
  }
}
