import type { HttpResponse } from '../types/types'

export const ok = (data: unknown): HttpResponse<unknown> => ({
  statusCode: 200,
  data,
})

export const notFound = (error: Error): HttpResponse<Error> => ({
  statusCode: 404,
  data: error,
})

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  data: error,
})

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  statusCode: 401,
  data: error,
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error,
})
