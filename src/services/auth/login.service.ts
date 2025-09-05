import type { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import type { InferFlattened, Users } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { generateToken } from '../auth/auth.service'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

/**
 * Authenticates a user and generates a JWT token.
 *
 * - Fetches the user from the `USERS` collection by username.
 * - Verifies the provided password against the stored hash.
 * - Throws an error if the user does not exist or the password is invalid.
 * - Generates a JWT token and updates the user record with it.
 *
 * @async
 * @function loginUserService
 * @param {InferFlattened<typeof LoginUserSchemas.request>} params - The login request payload containing username and password.
 * @returns {Promise<string>} A signed JWT token for the authenticated user.
 * @throws {Error} If the user does not exist or the password is invalid.
 */
export async function loginUserService({
  username,
  password,
}: InferFlattened<typeof LoginUserSchemas.request>): Promise<string> {
  const users = await getCollection<Users>(COLLECTIONS.USERS)

  const user = await users.findOne({ username })

  if (!user) {
    throwError(APPLICATION_ERRORS.USERS.WRONG_PASSWORD)
  }

  const validPassword = Bun.password.verifySync(password, user.password)

  if (!validPassword) {
    throwError(APPLICATION_ERRORS.USERS.WRONG_PASSWORD)
  }

  const token = await generateToken(user._id.toHexString())

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        token,
      },
    },
  )

  return token
}
