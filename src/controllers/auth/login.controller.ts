import type { InferFlattened } from '../../types/types'

import { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import { loginUserService } from '../../services/auth/login.service'
import { parseOutput } from '../../utils/parser.utils'
import { ok } from '../../utils/http-responses'

/**
 * Handles user login and returns an authentication token.
 *
 * - Validates the input against the `LoginUserSchemas.request`.
 * - Calls the login service to authenticate the user and generate a token.
 * - Formats the response using the `LoginUserSchemas.response` schema.
 *
 * @async
 * @function loginUserController
 * @param {InferFlattened<typeof LoginUserSchemas.request>} input - The login request payload.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing the authentication token.
 */
export const loginUserController = async (
  input: InferFlattened<typeof LoginUserSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  const userToken = await loginUserService(input)
  return ok(
    parseOutput({ data: { token: userToken } }, LoginUserSchemas.response),
  )
}
