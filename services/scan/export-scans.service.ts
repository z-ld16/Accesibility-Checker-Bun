import type { FindCursor } from 'mongodb'

import { Readable } from 'node:stream'
import { stringify } from 'csv'

import type { Scans } from '../../types/types'

import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export const exportScansCSVService = async () => {
  const scansCollection = await getCollection<Scans>(COLLECTIONS.SCANS)

  const cursor = scansCollection.find()

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
