import type { ObjectId } from 'mongodb'

import type { Users } from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from '../utils/errors.utils'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

export const UsersRepository = {
  async findOneByIdOrFail(id: ObjectId) {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const user = await users.findOne({ _id: id, deletedAt: undefined })

    if (!user) {
      throwError(APPLICATION_ERRORS.USERS.NOT_FOUND)
    }

    return user
  },

  async findOne(userData: Partial<Users>) {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const user = await users.findOne(userData)

    return user
  },

  async insert(userData: Users) {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const { insertedId } = await users.insertOne(userData)

    return await UsersRepository.findOneByIdOrFail(insertedId)
  },

  async setToken(id: ObjectId, token: string) {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    await users.updateOne(
      { _id: id },
      {
        $set: {
          token,
        },
      },
    )
  },

  async unsetToken(id: ObjectId) {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    await users.updateOne(
      { _id: id },
      {
        $unset: {
          token: true,
        },
      },
    )
  },
}
