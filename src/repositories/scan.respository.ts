import type { ObjectId } from 'mongodb'

import type { Scans } from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from '../utils/errors.utils'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

/**
 * Repository for interacting with the Scans collection in MongoDB.
 */
export const ScanRepository = {
  /**
   * Deletes a scan by its ID.
   *
   * @param {ObjectId} id - The ID of the scan to delete.
   * @returns {Promise<{ deletedCount?: number }>} Result of the deletion operation.
   */
  async deleteById(id: ObjectId): Promise<{ deletedCount?: number }> {
    const scans = await getCollection(COLLECTIONS.SCANS)
    return scans.deleteOne({ _id: id })
  },

  /**
   * Retrieves all scans with pagination and the total count.
   *
   * @param {number} limit - Maximum number of scans to return.
   * @param {number} offset - Number of scans to skip.
   * @returns {Promise<{ scans: Scans[], count: number }>} Object containing the scans and the total count.
   */
  async getAllScansAndCount(
    limit: number,
    offset: number,
  ): Promise<{ scans: Scans[]; count: number }> {
    const scans = await getCollection<Scans>(COLLECTIONS.SCANS)
    const count = (await scans.countDocuments()) || 0
    const rawScans = await scans.find().skip(offset).limit(limit).toArray()

    return {
      scans: rawScans,
      count,
    }
  },

  /**
   * Finds a scan by ID.
   * Throws an error if the scan does not exist.
   *
   * @param {ObjectId} id - The ID of the scan.
   * @returns {Promise<Scans>} The scan document.
   * @throws Will throw an error if the scan is not found.
   */
  async getOneOrFail(id: ObjectId): Promise<Scans> {
    const scans = await getCollection<Scans>(COLLECTIONS.SCANS)
    const scan = await scans.findOne({ _id: id })

    if (!scan) {
      throwError(APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR)
    }

    return scan
  },

  /**
   * Inserts a new scan or updates an existing one based on the URL.
   *
   * @param {{ url: string, violations: Scans['violations'] }} param0 - Scan data with URL and violations.
   * @returns {Promise<void>}
   */
  async upsertOne({
    url,
    violations,
  }: Pick<Scans, 'url' | 'violations'>): Promise<void> {
    const scans = await getCollection<Scans>(COLLECTIONS.SCANS)

    await scans.updateOne(
      { url },
      {
        $set: {
          violations,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          url,
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    )
  },

  /**
   * Returns a MongoDB cursor for the scans collection.
   * Useful for streaming or iterating over all documents.
   *
   * @returns {Promise<import('mongodb').FindCursor<Scans>>} A MongoDB cursor for the scans collection.
   */
  async getCursor(): Promise<import('mongodb').FindCursor<Scans>> {
    const scansCollection = await getCollection<Scans>(COLLECTIONS.SCANS)
    return scansCollection.find()
  },
}
