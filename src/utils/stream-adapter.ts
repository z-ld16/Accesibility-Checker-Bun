import type { Response, Request } from 'express'

import { Readable } from 'node:stream'
import consola from 'consola'
import z from 'zod/v4'

import type { InferFlattened, RequestSchema } from '../types/types'

import { APPLICATION_ERRORS } from '../errors/errors'

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

      stream.on('error', err => {
        if (!res.headersSent) {
          res
            .status(APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode)
            .json({
              data: {
                message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message,
              },
            })
        } else {
          res.destroy(err)
        }
      })

      stream.pipe(res)

      res.on('close', () => {
        stream.destroy()
      })
    } catch (err: unknown) {
      consola.log(err)
      return res
        .status(APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode)
        .json({
          data: {
            message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message,
          },
        })
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
