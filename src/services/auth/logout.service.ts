import { ObjectId } from 'mongodb'

import type { LogoutUserSchemas } from '../../schemas/users/logout.schema'
import type { InferFlattened } from '../../types/types'

import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

/**
 * Logs out a user by invalidating their stored JWT token.
 *
 * - Finds the user in the `USERS` collection by their `userId` from the token payload.
 * - Sets the `token` field to an empty string, effectively revoking access.
 *
 * @async
 * @function logoutUserService
 * @param {InferFlattened<typeof LogoutUserSchemas.request>} params - The logout request payload containing decoded token data.
 * @returns {Promise<void>} Resolves when the user has been logged out successfully.
 */
export async function logoutUserService({
  tokenData,
}: InferFlattened<typeof LogoutUserSchemas.request>): Promise<void> {
  const users = await getCollection(COLLECTIONS.USERS)

  const user = await users.findOne({ _id: new ObjectId(tokenData.userId) })

  await users.updateOne(
    { _id: user!._id },
    {
      $set: {
        token: '',
      },
    },
  )
}
