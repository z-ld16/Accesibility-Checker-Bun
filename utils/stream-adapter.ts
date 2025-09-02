import type { Response, Request } from 'express'

import { Readable } from 'node:stream'
import z, { ZodError } from 'zod/v4'

import type { InferFlattened, RequestSchema } from '../types/types'

import { unauthorized, serverError, badRequest } from './http-responses'
import { UnauthorizedError } from '../errors/services.errors'

export function adaptStreamHandler<T extends RequestSchema, P>(
  controller: (
    input: InferFlattened<T> | undefined,
  ) => Promise<Readable> | Readable,
  schema: {
    request?: T
    response: P
  },
) {
  return async (req: Request, res: Response) => {
    try {
      const stream = await controller(parseInput(req, schema.request))

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename=data.csv')
      res.status(200)

      stream.pipe(res)

      res.on('close', () => {
        stream.destroy()
      })
    } catch (err: unknown) {
      if (err instanceof UnauthorizedError) {
        const { statusCode, data } = unauthorized(err)
        return res.status(statusCode).json(data)
      }
      if (err instanceof ZodError) {
        const { statusCode } = badRequest(err)
        return res.status(statusCode).json({ data: z.formatError(err) })
      }
      const { statusCode, data } = serverError(
        new Error('Server error contact support'),
      )
      return res.status(statusCode).json({ error: data })
    }
  }
}

const EmptySchema = z.object({})

function parseInput(req: Request, schema: RequestSchema = EmptySchema) {
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
