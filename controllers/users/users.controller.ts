import { ZodError } from 'zod'

import type { InferFlattened } from '../../types/types'

import { CreateUserSchemas } from '../../schemas/users/users.schemas'
import { loginUserService } from '../../services/users/login.service'
import { createUserService } from '../../services/users/get-by-id'
import { serverError, ok } from '../../utils/http-responses'
import { ServerError } from '../../errors/http.errors'

export const createUserController = async (
  input: InferFlattened<typeof CreateUserSchemas.request>,
) => {
  try {
    const scan = await createUserService(input)
    return ok(
      CreateUserSchemas.response.strip().parse({
        data: scan,
      }),
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}

export const loginUserController = async (
  input: InferFlattened<typeof CreateUserSchemas.request>,
) => {
  try {
    const scan = await loginUserService(input)
    return ok(
      CreateUserSchemas.response.strip().parse({
        data: scan,
      }),
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}
