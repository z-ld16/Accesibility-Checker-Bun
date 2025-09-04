import type { Response, Request } from 'express'

import z, { ZodError } from 'zod/v4'

import type {
  PaginatedResponseSchema,
  InferFlattened,
  ResponseSchema,
  RequestSchema,
  HttpResponse,
} from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'
import { ApplicationError } from './errors.utils'

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
      const input = parseInput(req, schema.request)
      const { statusCode, data } = await controller(input)
      return res.status(statusCode).json(data)
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const { statusCode, message } = APPLICATION_ERRORS.GENERIC.INVALID_INPUT
        return res.status(statusCode).json({
          data: {
            message,
            stack: z.formatError(err),
          },
        })
      }
      if (err instanceof ApplicationError) {
        return res
          .status(err.statusCode)
          .json({ error: { data: { message: err.message } } })
      }
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
