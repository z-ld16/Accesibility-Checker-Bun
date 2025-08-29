import { ZodError } from 'zod'
import consola from 'consola'

import type { InferFlattened } from '../../types/types'

import { logoutUserService } from '../../services/auth/logout.service'
import { LogoutUserSchemas } from '../../schemas/users/logout.schema'
import { serverError, ok } from '../../utils/http-responses'
import { ServerError } from '../../errors/http.errors'

export const logoutUserController = async (
  input: InferFlattened<typeof LogoutUserSchemas.request>,
) => {
  try {
    await logoutUserService(input)
    return ok(
      LogoutUserSchemas.response.strip().parse({
        data: {
          message: 'Logged out succesfully',
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
