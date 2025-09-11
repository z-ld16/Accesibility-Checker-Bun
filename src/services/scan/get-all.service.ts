import { ScanRepository } from '../../repositories/scan.respository'

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
export const getAllScansServices = async (
  limit: number,
  offset: number,
): Promise<{ scans: object[]; count: number }> => {
  return ScanRepository.getAllScansAndCount(limit, offset)
}
