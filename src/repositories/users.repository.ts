import type { ObjectId } from 'mongodb'

import type { Users } from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from '../utils/errors.utils'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

/**
 * Repository for interacting with the Users collection in MongoDB.
 */
export const UsersRepository = {
  /**
   * Finds a user by their ID.
   * Throws an error if the user does not exist or has been deleted.
   *
   * @param {ObjectId} id - The ObjectId of the user to find.
   * @returns {Promise<Users>} The user document.
   * @throws Will throw an error if the user is not found.
   */
  async findOneByIdOrFail(id: ObjectId): Promise<Users> {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const user = await users.findOne({ _id: id, deletedAt: undefined })

    if (!user) {
      throwError(APPLICATION_ERRORS.USERS.NOT_FOUND)
    }

    return user
  },

  /**
   * Finds a single user based on the provided data.
   *
   * @param {Partial<Users>} userData - Partial user fields to search for.
   * @returns {Promise<Users | null>} The user document if found, otherwise null.
   */
  async findOne(userData: Partial<Users>): Promise<Users | null> {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const user = await users.findOne(userData)

    return user
  },

  /**
   * Inserts a new user into the collection and returns the created user.
   *
   * @param {Users} userData - The user data to insert.
   * @returns {Promise<Users>} The newly inserted user document.
   */
  async insert(userData: Users): Promise<Users> {
    const users = await getCollection<Users>(COLLECTIONS.USERS)
    const { insertedId } = await users.insertOne(userData)

    return await UsersRepository.findOneByIdOrFail(insertedId)
  },

  /**
   * Sets a token for a user by their ID.
   *
   * @param {ObjectId} id - The ObjectId of the user.
   * @param {string} token - The token to set.
   * @returns {Promise<void>}
   */
  async setToken(id: ObjectId, token: string): Promise<void> {
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

  /**
   * Removes the token field from a user by their ID.
   *
   * @param {ObjectId} id - The ObjectId of the user.
   * @returns {Promise<void>}
   */
  async unsetToken(id: ObjectId): Promise<void> {
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
