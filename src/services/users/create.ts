import type { CreateUserSchemas } from '../../schemas/users/users.schemas'
import type { InferFlattened, Users } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

/**
 * Creates a new user in the database.
 *
 * - Checks if a user with the same username already exists and throws an error if so.
 * - Hashes the user's password before storing it.
 * - Inserts the new user into the `USERS` collection.
 * - Returns the newly created user document.
 *
 * @async
 * @function createUserService
 * @param {InferFlattened<typeof CreateUserSchemas.request>} params - The payload containing `username` and `password`.
 * @returns {Promise<Users>} The newly created user document.
 * @throws {Error} If a user with the given username already exists.
 */
export async function createUserService({
  username,
  password,
}: InferFlattened<typeof CreateUserSchemas.request>): Promise<Users> {
  const users = await getCollection<Users>(COLLECTIONS.USERS)

  const usernameExists = await users.findOne({ username })

  if (usernameExists?._id) {
    throwError(APPLICATION_ERRORS.USERS.USERNAME_FOUND)
  }

  const { insertedId } = await users.insertOne({
    username,
    password: Bun.password.hashSync(password, 'bcrypt'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const newUser = await users.findOne({ _id: insertedId })

  if (!newUser) {
    throwError(APPLICATION_ERRORS.GENERIC.DB_ERROR)
  }

  return newUser
}
