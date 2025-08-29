import { ZodError } from 'zod'

import type { InferFlattened } from '../../types/types'

import { UsernameAlreadyExistsError } from '../../errors/users-services.errors'
import { serverError, badRequest, ok } from '../../utils/http-responses'
import { CreateUserSchemas } from '../../schemas/users/users.schemas'
import { createUserService } from '../../services/users/get-by-id'
import { ServerError } from '../../errors/http.errors'

export const createUserController = async (
  input: InferFlattened<typeof CreateUserSchemas.request>,
) => {
  try {
    const user = await createUserService(input)
    return ok(
      CreateUserSchemas.response.strip().parse({
        data: user,
      }),
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    if (error instanceof UsernameAlreadyExistsError) {
      return badRequest(error)
    }
    throw error
  }
}
