import type { ObjectId } from 'mongodb'

import type { Scans } from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from '../utils/errors.utils'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

export const ScanRepository = {
  async deleteById(id: ObjectId) {
    const scans = await getCollection(COLLECTIONS.SCANS)

    return scans.deleteOne({ _id: id })
  },

  async getAllScansAndCount(limit: number, offset: number) {
    const scans = await getCollection(COLLECTIONS.SCANS)
    const count = (await scans.countDocuments()) || 0
    const rawScans = await scans.find().skip(offset).limit(limit).toArray()

    return {
      scans: rawScans,
      count,
    }
  },

  async getOneOrFail(id: ObjectId) {
    const scans = await getCollection<Scans>(COLLECTIONS.SCANS)
    const scan = await scans.findOne({ _id: id })

    if (!scan) {
      throwError(APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR)
    }

    return scan
  },

  async upsertOne({ url, violations }: Pick<Scans, 'url' | 'violations'>) {
    const scans = await getCollection(COLLECTIONS.SCANS)

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

  async getCursor() {
    const scansCollection = await getCollection<Scans>(COLLECTIONS.SCANS)
    return scansCollection.find()
  },
}
