import type { Request } from 'express'

import { type ZodType, z } from 'zod'

import type { RequestSchema } from '../types/types'

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

const EmptySchema = z.object({})

export function parseInput(req: Request, schema: RequestSchema = EmptySchema) {
  const parsed = schema.strip().parse({
    body: req?.body,
    params: req?.params,
    query: req?.query,
  })

  return {
    ...(parsed?.params ?? {}),
    ...(parsed?.body ?? {}),
    ...(parsed?.query ?? {}),
  }
}
