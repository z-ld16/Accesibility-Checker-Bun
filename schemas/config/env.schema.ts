import z from 'zod/v4'

export const EnvVariablesSchema = z.object({
  JWT_SECRET: z.string(),
  DB_NAME: z.string(),
  MONGO_URI: z.string(),
  PORT: z
    .string()
    .refine(val => !isNaN(Number(val)))
    .transform(val => Number(val)),
})
