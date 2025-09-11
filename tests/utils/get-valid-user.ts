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

export async function getExpiredUser(db: Db) {
  const expiredUser = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ username: 'expiredUser' })

  if (!expiredUser) {
    throw new Error('User not found')
  }
  return expiredUser
}

export async function getNoTokenUser(db: Db) {
  const noTokenUser = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ username: 'noTokenUser' })

  if (!noTokenUser) {
    throw new Error('User not found')
  }
  return noTokenUser
}

export async function getDeletedUser(db: Db) {
  const deletedUser = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ username: 'deletedUser' })

  if (!deletedUser) {
    throw new Error('User not found')
  }
  return deletedUser
}
