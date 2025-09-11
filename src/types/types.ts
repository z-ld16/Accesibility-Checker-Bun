import type { ZodRawShape, ZodObject, ZodArray, z } from 'zod/v4'
import type { ObjectId } from 'mongodb'

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

export type Scans = {
  _id: ObjectId
  url: string
  createdAt: string
  updatedAt: string
  violations: Violations[]
}

type Violations = {
  id: string
  impact?: string | null
  description: string
}

export type Users = {
  _id?: ObjectId
  username: string
  password: string
  createdAt?: string
  updatedAt?: string
  token?: string
}
