import type { FindCursor } from 'mongodb'

import { Readable } from 'node:stream'
import { stringify } from 'csv'

import type { Scans } from '../../types/types'

import { ScanRepository } from '../../repositories/scan.respository'

/**
 * Exports all scan documents as a CSV stream.
 *
 * - Fetches all scans from the `SCANS` collection.
 * - Flattens each scan's violations into individual rows.
 * - Pipes the results through a CSV stringifier.
 *
 * @async
 * @function exportScansCSVService
 * @returns {Promise<NodeJS.ReadableStream>} A readable stream containing the CSV data.
 */
export const exportScansCSVService =
  async (): Promise<NodeJS.ReadableStream> => {
    const cursor = await ScanRepository.getCursor()
    const stringifier = stringify({
      header: true,
      columns: [
        '_id',
        'url',
        'createdAt',
        'updatedAt',
        'violationId',
        'violationImpact',
        'violationDescription',
      ],
    })

    return Readable.from(generateScanRows(cursor)).pipe(stringifier)
  }

/**
 * Async generator that produces CSV rows from a cursor of scans.
 *
 * - Iterates over each scan document.
 * - Yields one row per violation, flattening the data for CSV export.
 *
 * @async
 * @generator
 * @function generateScanRows
 * @param {FindCursor<Scans>} cursor - MongoDB cursor for the scans collection.
 * @yields {object} Flattened scan violation row for CSV output.
 */
async function* generateScanRows(cursor: FindCursor<Scans>) {
  try {
    for await (const scan of cursor) {
      for (const v of scan.violations) {
        yield {
          _id: scan._id.toHexString(),
          url: scan.url,
          createdAt: scan.createdAt,
          updatedAt: scan.updatedAt,
          violationId: v.id,
          violationImpact: v.impact,
          violationDescription: v.description,
        }
      }
    }
  } finally {
    cursor.close()
  }
}
