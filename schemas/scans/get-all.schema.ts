import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const GetAllScansResponseSchema = z.object({
  data: z.array(
    z.object({
      _id: z.instanceof(ObjectId).transform(val => val.toHexString()),
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
  ),
  pageInfo: z.object({
    pages: z.number(),
    currentPage: z.number(),
  }),
})

const GetAllScansRequestSchema = z.object({
  query: z.object({
    limit: z
      .string()
      .refine(v => !Number.isNaN(Number(v)))
      .transform(v => Number(v)),
    offset: z
      .string()
      .refine(v => !Number.isNaN(Number(v)))
      .transform(v => Number(v)),
  }),
})

export const GetAllScansSchemas = {
  request: GetAllScansRequestSchema,
  response: GetAllScansResponseSchema,
}
