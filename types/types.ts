import type { ZodRawShape, ZodObject, ZodArray, z } from 'zod/v4'

export type RequestSchema<
  P extends ZodRawShape = z.ZodRawShape,
  B extends ZodRawShape = z.ZodRawShape,
  Q extends ZodRawShape = z.ZodRawShape,
> = ZodObject<{
  params?: ZodObject<P>
  body?: ZodObject<B>
  query?: ZodObject<Q>
}>

export type ResponseSchema<P extends ZodRawShape = z.ZodRawShape> = ZodObject<{
  data: ZodObject<P>
}>

export type PaginatedResponseSchema<P extends ZodRawShape = z.ZodRawShape> =
  ZodObject<{
    data: ZodArray<ZodObject<P>>
    pageInfo: z.ZodObject<{
      pages: z.ZodNumber
      currentPage: z.ZodNumber
    }>
  }>

type FlattenSchema<
  T extends { params?: object; body?: object; query?: object },
> = NonNullable<T['params']> & NonNullable<T['body']> & NonNullable<T['query']>

export type InferFlattened<T extends ZodObject<ZodRawShape>> = FlattenSchema<
  z.infer<T>
>

export type HttpResponse<T> = {
  statusCode: number
  data: T
}
