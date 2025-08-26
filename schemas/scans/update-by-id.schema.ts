import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const UpdateScanByIdRequestSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})

const UpdateScanByIdResponseSchema = z.object({
  data: z.object({
    message: z.string(),
  }),
})

export const UpdateScanByIdSchemas = {
  request: UpdateScanByIdRequestSchema,
  response: UpdateScanByIdResponseSchema,
}
