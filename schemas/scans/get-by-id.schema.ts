import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const GetScanByIdRequestSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})

const GetScanByIdResponseSchema = z.object({
  data: z.object({
    _id: z.instanceof(ObjectId).transform(val => val.toString()),
    url: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    violations: z.array(
      z.object({
        id: z.string(),
        impact: z.string(),
        description: z.string(),
      }),
    ),
  }),
})

export const GetScanByIdSchemas = {
  request: GetScanByIdRequestSchema,
  response: GetScanByIdResponseSchema,
}
