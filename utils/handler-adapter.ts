import type { Response, Request } from 'express'

import z, { ZodError } from 'zod/v4'
import consola from 'consola'

import type {
  PaginatedResponseSchema,
  InferFlattened,
  ResponseSchema,
  RequestSchema,
  HttpResponse,
} from '../types/types'

export function adaptHandler<
  T extends RequestSchema,
  P extends ResponseSchema,
  R,
>(
  controller: (
    input: InferFlattened<T>,
  ) => Promise<HttpResponse<R>> | HttpResponse<R>,
  schema: {
    request?: T
    response: P
  },
): (req: Request, res: Response) => Promise<R>

export function adaptHandler<
  T extends RequestSchema,
  P extends PaginatedResponseSchema,
  R,
>(
  controller: (input: InferFlattened<T>) => Promise<R> | R,
  schema: {
    request: T
    response: P
  },
): (req: Request, res: Response) => Promise<R>

export function adaptHandler<
  T extends RequestSchema,
  P extends ResponseSchema,
  R,
>(
  controller: () => Promise<HttpResponse<R>> | HttpResponse<R>,
  schema: {
    request: T
    response: P
  },
): (req: Request, res: Response) => Promise<R>

export function adaptHandler<
  T extends RequestSchema,
  P extends ResponseSchema,
  R,
>(
  controller: (
    input: InferFlattened<T> | undefined,
  ) => Promise<HttpResponse<R>> | HttpResponse<R>,
  schema: {
    request?: T
    response: P
  },
) {
  return async (req: Request, res: Response) => {
    try {
      const input = parseInput(req, schema.request)
      const { statusCode, data } = await controller(input)
      return res.status(statusCode).json(data)
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            message: z.formatError(err),
          },
        })
      }
      consola.error(err)
      return res.status(500).json({ error: 'Server Error' })
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
