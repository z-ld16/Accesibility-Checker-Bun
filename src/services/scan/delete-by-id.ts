import type { ObjectId } from 'mongodb'

import { ScanRepository } from '../../repositories/scan.respository'

/**
 * Deletes a scan document by its ID.
 *
 * - Looks up the `SCANS` collection.
 * - Removes the document that matches the provided ObjectId.
 *
 * @async
 * @function deleteScanByIdService
 * @param {ObjectId} id - The ID of the scan to delete.
 * @returns {Promise<import('mongodb').DeleteResult>} The result of the delete operation.
 */
export async function deleteScanByIdService(
  id: ObjectId,
): Promise<import('mongodb').DeleteResult> {
  return ScanRepository.deleteById(id)
}
