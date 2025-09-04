import type { NextFunction, Response, Request } from 'express'

import { ObjectId } from 'mongodb'

import type { Users } from '../types/types'

import { ApplicationError, throwError } from '../utils/errors.utils'
import { TokenPayloadSchema } from '../schemas/auth/auth.schemas'
import { verifyToken } from '../services/auth/auth.service'
import { APPLICATION_ERRORS } from '../errors/errors'
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
      throwError(APPLICATION_ERRORS.AUTH.TOKEN_MISSING)
    }

    const rawDecodedToken = await verifyToken(token)

    const decodedToken = TokenPayloadSchema.parse(rawDecodedToken)

    const users = await getCollection<Users>(COLLECTIONS.USERS)

    const user = await users.findOne({
      _id: new ObjectId(decodedToken.userId),
    })

    if (!user || token !== user.token) {
      throwError(APPLICATION_ERRORS.AUTH.DB_TOKEN_NOT_FOUND)
    }

    if (!req.body) {
      req.body = {
        tokenData: decodedToken,
      }
    }

    req.body.tokenData = decodedToken

    next()
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.statusCode).json({ data: { message: error.message } })
    }
    res.status(APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode).json({
      data: { message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message },
    })
  }
}
