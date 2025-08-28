import consola from 'consola'

import { EnvVariablesSchema } from '../schemas/config/env.schema'

const requiredVars = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'DB_NAME']

type RequiredEnv = {
  [K in (typeof requiredVars)[number]]: string
}

export function loadEnv() {
  const missing: string[] = []

  const env = {} as RequiredEnv

  for (const key of requiredVars) {
    const value = process.env[key]
    if (!value) {
      missing.push(key)
    } else {
      env[key] = value
    }
  }

  if (missing.length > 0) {
    consola.error(
      `❌ Missing required environment variables: ${missing.join(', ')}`,
    )
    process.exit(1)
  }

  return EnvVariablesSchema.parse(env)
}
