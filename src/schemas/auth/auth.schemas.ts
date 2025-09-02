import { ObjectId } from 'mongodb'
import z from 'zod/v4'

export const TokenPayloadSchema = z.object({
  userId: z.string().refine(val => ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  iat: z.number(),
  exp: z.number(),
})
