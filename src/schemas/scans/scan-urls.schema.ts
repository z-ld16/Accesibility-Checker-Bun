import z from 'zod/v4'

const HttpHttpsUrl = z
  .string()
  .min(1, 'URL is required')
  .regex(
    /^https?:\/\/(?:www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+$/i,
    'Invalid HTTP/HTTPS URL',
  )

const ScanURLSRequestSchema = z.object({
  body: z.object({
    urls: z.array(HttpHttpsUrl).min(1),
  }),
})

const ScanURLSResponseSchema = z.object({
  data: z.object({
    message: z.string(),
  }),
})

export const ScanURLSSchemas = {
  request: ScanURLSRequestSchema,
  response: ScanURLSResponseSchema,
}
