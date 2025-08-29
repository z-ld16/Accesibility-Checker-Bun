import z from 'zod/v4'

const LogoutRequestSchema = z.object({
  body: z.object({
    tokenData: z.object({
      userId: z.string(),
    }),
  }),
})

const LogoutResponseSchema = z.object({
  data: z.object({
    message: z.string(),
  }),
})

export const LogoutUserSchemas = {
  request: LogoutRequestSchema,
  response: LogoutResponseSchema,
}
