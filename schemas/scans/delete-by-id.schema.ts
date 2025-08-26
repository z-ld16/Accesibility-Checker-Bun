import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const DeleteScanByIdRequestSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})

const DeleteScanByIdResponseSchema = z.object({
  data: z.object({
    message: z.string(),
  }),
})

export const DeleteScanByIdSchemas = {
  request: DeleteScanByIdRequestSchema,
  response: DeleteScanByIdResponseSchema,
}
