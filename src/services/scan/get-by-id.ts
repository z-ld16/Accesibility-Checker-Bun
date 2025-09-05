import type { ObjectId } from 'mongodb'

import type { Scans } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

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
  const scans = await getCollection<Scans>(COLLECTIONS.SCANS)
  const scan = await scans.findOne({ _id: id })

  if (!scan) {
    throwError(APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR)
  }

  return scan
}
