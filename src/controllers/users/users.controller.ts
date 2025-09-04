import type { InferFlattened } from '../../types/types'

import { CreateUserSchemas } from '../../schemas/users/users.schemas'
import { createUserService } from '../../services/users/get-by-id'
import { parseOutput } from '../../utils/parser.utils'
import { ok } from '../../utils/http-responses'

export const createUserController = async (
  input: InferFlattened<typeof CreateUserSchemas.request>,
) => {
  const user = await createUserService(input)
  return ok(parseOutput(user, CreateUserSchemas.response))
}
