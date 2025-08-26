import type { HttpResponse } from '../types/types'

export const ok = (data: unknown): HttpResponse<unknown> => ({
  statusCode: 200,
  data,
})

export const notFound = (error: Error): HttpResponse<Error> => ({
  statusCode: 404,
  data: error,
})
