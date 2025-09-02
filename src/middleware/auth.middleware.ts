import type { NextFunction, Response, Request } from 'express'

import { ObjectId } from 'mongodb'
import consola from 'consola'

import type { Users } from '../types/types'

import { TokenPayloadSchema } from '../schemas/auth/auth.schemas'
import { UnauthorizedError } from '../errors/services.errors'
import { verifyToken } from '../services/auth/auth.service'
import { unauthorized } from '../utils/http-responses'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

export async function checkToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers['authorization']

    if (!token) {
      throw new UnauthorizedError('Token is missing')
    }

    const rawDecodedToken = await verifyToken(token)

    consola.log(rawDecodedToken)

    const decodedToken = TokenPayloadSchema.parse(rawDecodedToken)

    const users = await getCollection<Users>(COLLECTIONS.USERS)

    const user = await users.findOne({
      _id: new ObjectId(decodedToken.userId),
    })

    if (!user || token !== user.token) {
      throw new UnauthorizedError('User doesnt exist')
    }

    if (!req.body) {
      req.body = {
        tokenData: decodedToken,
      }
    }

    req.body.tokenData = decodedToken

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
