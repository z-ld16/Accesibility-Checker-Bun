import type { InferFlattened } from '../../types/types'

import { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import { loginUserService } from '../../services/auth/login.service'
import { parseOutput } from '../../utils/parser.utils'
import { ok } from '../../utils/http-responses'

export const loginUserController = async (
  input: InferFlattened<typeof LoginUserSchemas.request>,
) => {
  const userToken = await loginUserService(input)
  return ok(
    parseOutput({ data: { token: userToken } }, LoginUserSchemas.response),
  )
}
