import type { Db } from 'mongodb'

import { COLLECTIONS } from '../../src/config'
import { userSeeds } from './seeds/users-seed'
import { scanSeeds } from './seeds/scan-seed'

export async function seedDb(db: Db) {
  await db.collection(COLLECTIONS.SCANS).insertMany(scanSeeds)
  await db.collection(COLLECTIONS.USERS).insertMany(userSeeds)
}
