import type { ObjectId } from 'mongodb'

import type { Scans } from '../../types/types'

import { ScanRepository } from '../../repositories/scan.respository'

/**
 * Retrieves a scan document by its ID.
 *
 * - Fetches the scan from the `SCANS` collection.
 * - Throws an error if the scan is not found.
 *
 * @async
 * @function getScanByIdService
 * @param {ObjectId} id - The ID of the scan to retrieve.
 * @returns {Promise<Scans>} The scan document from the database.
 * @throws {Error} If no scan with the given ID exists.
 */
export async function getScanByIdService(id: ObjectId): Promise<Scans> {
  return await ScanRepository.getOneOrFail(id)
}
