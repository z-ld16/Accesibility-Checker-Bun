import type { HttpResponse } from '../types/types'

export const ok = (data: unknown): HttpResponse<unknown> => ({
  statusCode: 200,
  data,
})
