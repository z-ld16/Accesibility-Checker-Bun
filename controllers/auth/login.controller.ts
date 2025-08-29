import { ZodError } from 'zod'
import consola from 'consola'

import type { InferFlattened } from '../../types/types'

import { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import { loginUserService } from '../../services/auth/login.service'
import { serverError, ok } from '../../utils/http-responses'
import { ServerError } from '../../errors/http.errors'

export const loginUserController = async (
  input: InferFlattened<typeof LoginUserSchemas.request>,
) => {
  try {
    const userToken = await loginUserService(input)
    return ok(
      LoginUserSchemas.response.strip().parse({
        data: {
          token: userToken,
        },
      }),
    )
  } catch (error) {
    consola.log(error)
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}
