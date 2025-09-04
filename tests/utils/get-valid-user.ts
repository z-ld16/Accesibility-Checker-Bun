import type { Db } from 'mongodb'

import { COLLECTIONS } from '../../src/config'

export async function getValidUser(db: Db) {
  const validUser = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ username: 'validUser' })

  if (!validUser) {
    throw new Error('User not found')
  }
  return validUser
}
