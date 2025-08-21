import type { Response, Request } from 'express'

import { ZodError } from 'zod/v4'
import consola from 'consola'

import type { InferFlattened, RequestSchema } from '../types/types'

import { NotFoundError } from '../errors/http.errors'

export function adaptHandler<T extends RequestSchema, R>(
  controller: (input: InferFlattened<T>) => Promise<R> | R,
  schema: T,
): (req: Request, res: Response) => Promise<R>

export function adaptHandler<R>(
  controller: () => Promise<R> | R,
): (req: Request, res: Response) => Promise<R>

export function adaptHandler<T extends RequestSchema, R>(
  controller: (input: InferFlattened<T> | undefined) => Promise<R> | R,
  schema?: RequestSchema,
) {
  return async (req: Request, res: Response) => {
    try {
      if (!schema) {
        const result = await controller(undefined)
        return res.json(result)
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

      const result = await controller(input)

      return res.json(result)
    } catch (err: unknown) {
      consola.error(err)
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err })
      }
      if (err instanceof Error) {
        return res.status(500).json({ error: err })
      }
      if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err })
      }
      return res.status(500).json({ error: 'Server Error' })
    }
  }
}
