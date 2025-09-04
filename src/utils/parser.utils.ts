import type { ZodType } from 'zod'

import { APPLICATION_ERRORS } from '../errors/errors'
import { throwError } from './errors.utils'

export function parseOutput<T extends ZodType = ZodType>(
  payload: unknown,
  schema: T,
) {
  const result = schema.safeParse(payload)

  if (!result.success) {
    throwError(APPLICATION_ERRORS.GENERIC.INVALID_OUTPUT)
  }

  return result.data
}
