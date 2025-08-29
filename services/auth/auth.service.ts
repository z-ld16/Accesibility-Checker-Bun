import { verify, sign } from 'jsonwebtoken'

import { loadEnv } from '../../config/environment-variables'

export async function generateToken(userId: string) {
  const { JWT_SECRET, JWT_EXPIRES_IN_SECONDS } = loadEnv()
  const token = sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  })
  return token
}

export async function verifyToken(token: string) {
  const { JWT_SECRET } = loadEnv()
  const decodedToken = verify(token, JWT_SECRET)
  return decodedToken
}
