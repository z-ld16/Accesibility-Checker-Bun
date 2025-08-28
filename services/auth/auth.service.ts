import { verify, sign } from 'jsonwebtoken'

import { loadEnv } from '../../config/environment-variables'

export async function generateToken(userId: string) {
  const { JWT_SECRET } = loadEnv()
  const token = sign({ userId }, JWT_SECRET)
  return token
}

export async function verifyToken(token: string) {
  const { JWT_SECRET } = loadEnv()
  const decodedToken = verify(token, JWT_SECRET)
  return decodedToken
}
