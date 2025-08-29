import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const CreateUserRequestSchema = z.object({
  body: z.object({
    username: z.string().min(5),
    password: z.string().min(8),
  }),
})

const CreateUserResponseSchema = z.object({
  data: z.object({
    _id: z.instanceof(ObjectId).transform(val => val.toHexString()),
    username: z.string().min(5),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
})

export const CreateUserSchemas = {
  request: CreateUserRequestSchema,
  response: CreateUserResponseSchema,
}
