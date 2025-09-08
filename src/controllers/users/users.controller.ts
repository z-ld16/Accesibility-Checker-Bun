import type { InferFlattened } from '../../types/types'

import { CreateUserSchemas } from '../../schemas/users/users.schemas'
import { createUserService } from '../../services/users/create'
import { parseOutput } from '../../utils/parser.utils'
import { ok } from '../../utils/http-responses'

/**
 * Handles user creation.
 *
 * - Validates the input against the `CreateUserSchemas.request`.
 * - Calls the user service to create a new user in the database.
 * - Formats and returns the created user data using the `CreateUserSchemas.response` schema.
 *
 * @async
 * @function createUserController
 * @param {InferFlattened<typeof CreateUserSchemas.request>} input - The request payload for creating a user.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing the newly created user.
 */
export const createUserController = async (
  input: InferFlattened<typeof CreateUserSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  const user = await createUserService(input)
  return ok(parseOutput({ data: user }, CreateUserSchemas.response))
}
