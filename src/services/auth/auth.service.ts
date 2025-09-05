import { verify, sign } from 'jsonwebtoken'

import { loadEnv } from '../../config/environment-variables'

/**
 * Generates a JWT for the given user.
 *
 * - Signs a JWT containing the user ID.
 * - Uses the secret and expiration time defined in environment variables.
 *
 * @async
 * @function generateToken
 * @param {string} userId - The ID of the user for whom to generate the token.
 * @returns {Promise<string>} A signed JWT.
 */
export async function generateToken(userId: string): Promise<string> {
  const { JWT_SECRET, JWT_EXPIRES_IN_SECONDS } = loadEnv()
  const token = sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  })
  return token
}

/**
 * Verifies a JWT and returns the decoded payload.
 *
 * - Uses the secret defined in environment variables.
 * - Throws an error if the token is invalid or expired.
 *
 * @async
 * @function verifyToken
 * @param {string} token - The JWT to verify.
 * @returns {Promise<object | string>} The decoded token payload.
 */
export async function verifyToken(token: string): Promise<object | string> {
  const { JWT_SECRET } = loadEnv()
  const decodedToken = verify(token, JWT_SECRET)
  return decodedToken
}
