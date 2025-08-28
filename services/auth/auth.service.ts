import { verify, sign } from 'jsonwebtoken'

import { SECRET_JWT } from '../../config'

export async function generateToken(userId: string) {
  const token = sign({ userId }, SECRET_JWT)
  return token
}

export async function verifyToken(token: string) {
  const decodedToken = verify(token, SECRET_JWT)
  return decodedToken
}
