import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

/**
 * Retrieves a paginated list of scans from the database.
 *
 * - Fetches the total count of scan documents.
 * - Retrieves a subset of scans using `limit` and `offset`.
 *
 * @async
 * @function getAllScansServices
 * @param {number} limit - The maximum number of scans to return.
 * @param {number} offset - The number of scans to skip (for pagination).
 * @returns {Promise<{ scans: object[], count: number }>} An object containing the paginated scans and the total count.
 */
export const getAllScansServices = async (limit: number, offset: number) => {
  const scans = await getCollection(COLLECTIONS.SCANS)
  const count = (await scans.countDocuments()) || 0
  const rawScans = await scans.find().skip(offset).limit(limit).toArray()
  return {
    scans: rawScans,
    count,
  }
}
