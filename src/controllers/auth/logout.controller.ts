import type { InferFlattened } from '../../types/types'

import { logoutUserService } from '../../services/auth/logout.service'
import { LogoutUserSchemas } from '../../schemas/users/logout.schema'
import { ok } from '../../utils/http-responses'

/**
 * Handles user logout.
 *
 * - Validates the input against the `LogoutUserSchemas.request`.
 * - Calls the logout service to invalidate the user session/token.
 * - Returns a standardized response confirming successful logout.
 *
 * @async
 * @function logoutUserController
 * @param {InferFlattened<typeof LogoutUserSchemas.request>} input - The logout request payload.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing a confirmation message.
 */
export const logoutUserController = async (
  input: InferFlattened<typeof LogoutUserSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  await logoutUserService(input)
  return ok(
    LogoutUserSchemas.response.strip().parse({
      data: {
        message: 'Logged out successfully',
      },
    }),
  )
}
