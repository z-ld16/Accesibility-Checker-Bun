import type { ZodRawShape, ZodObject, z } from 'zod/v4'

export type RequestSchema<
  P extends ZodRawShape = {},
  B extends ZodRawShape = {},
  Q extends ZodRawShape = {},
> = ZodObject<{
  params?: ZodObject<P>
  body?: ZodObject<B>
  query?: ZodObject<Q>
}>

type FlattenSchema<
  T extends { params?: object; body?: object; query?: object },
> = NonNullable<T['params']> & NonNullable<T['body']> & NonNullable<T['query']>

export type InferFlattened<T extends ZodObject<ZodRawShape>> = FlattenSchema<
  z.infer<T>
>
