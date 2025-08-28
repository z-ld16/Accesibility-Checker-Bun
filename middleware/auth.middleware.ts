import type { NextFunction, Response, Request } from 'express'

import consola from 'consola'

import { UnauthorizedError } from '../errors/services.errors'
import { verifyToken } from '../services/auth/auth.service'
import { unauthorized } from '../utils/http-responses'

export function checkToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers['authorization']

    if (!token) {
      throw new UnauthorizedError('Token is missing')
    }

    const decodedToken = verifyToken(token)

    req.body.decodedToken = decodedToken

    next()
  } catch (error) {
    // Check this logic i dont like it
    consola.error(error)
    const { statusCode, data } = unauthorized(
      new UnauthorizedError('User is not authorized'),
    )
    res.status(statusCode).json(data)
  }
}
