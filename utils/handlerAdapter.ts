import type { Response, Request } from 'express'

import { ZodError } from 'zod/v4'
import consola from 'consola'

import type { InferFlattened, RequestSchema } from '../types/types'

import { NotFoundError } from '../errors/http.errors'

export function adaptHandler<T extends RequestSchema, R>(
  controller: (input: InferFlattened<T>) => Promise<R> | R,
  schema: T,
): (req: unknown) => Promise<R>

export function adaptHandler<R>(
  controller: (input: undefined) => Promise<R> | R,
): (req: unknown) => Promise<R>

export function adaptHandler<T extends RequestSchema, R>(
  controller: (input: InferFlattened<T> | undefined) => Promise<R> | R,
  schema?: RequestSchema,
) {
  return async (req: Request, res: Response) => {
    try {
      if (!schema) {
        return controller(undefined)
      }

      const parsed = schema.parse({
        body: req?.body,
        params: req?.params,
        query: req?.query,
      })

      const input = {
        ...(parsed?.params ?? {}),
        ...(parsed?.body ?? {}),
        ...(parsed?.query ?? {}),
      }

      return controller(input)
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err })
      }
      if (err instanceof Error) {
        consola.error(err.message)
        return res.status(500)
      }
      if (err instanceof NotFoundError) {
        consola.error(err.message)
        return res.status(404)
      }
      consola.error(err)
      res.status(500)
    }
  }
}
