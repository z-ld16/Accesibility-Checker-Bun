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

import { unauthorized, serverError, badRequest } from './http-responses'
import { UnauthorizedError } from '../errors/services.errors'

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
  controller: (
    input: InferFlattened<T>,
  ) => Promise<HttpResponse<R>> | HttpResponse<R>,
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
      consola.log(req.body)
      const input = parseInput(req, schema.request)
      const { statusCode, data } = await controller(input)
      return res.status(statusCode).json(data)
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
