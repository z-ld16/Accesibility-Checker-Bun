import z from 'zod/v4'

const LoginUserRequestSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
})

const LoginUserResponseSchema = z.object({
  data: z.object({
    token: z.jwt(),
  }),
})

export const LoginUserSchemas = {
  request: LoginUserRequestSchema,
  response: LoginUserResponseSchema,
}
