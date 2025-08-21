import { ObjectId } from 'mongodb'
import z from 'zod/v4'

const httpHttpsUrlRegex = /^https?:\/\/(?:www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+$/i

export const HttpHttpsUrl = z
  .string()
  .min(1, 'URL is required')
  .regex(httpHttpsUrlRegex, 'Invalid HTTP/HTTPS URL')

export const ScanURLSSchema = z.object({
  body: z.object({
    urls: z.array(HttpHttpsUrl).min(1),
  }),
  params: z.object({}),
  query: z.object({}),
})

export const GetScanByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})

export const UpdateScanByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})

export const DeleteScanByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(val => ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .transform(val => new ObjectId(val)),
  }),
})
