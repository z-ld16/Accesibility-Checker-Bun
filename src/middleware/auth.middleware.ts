import type { NextFunction, Response, Request } from 'express'

import { ObjectId } from 'mongodb'

import type { Users } from '../types/types'

import { ApplicationError, throwError } from '../utils/errors.utils'
import { TokenPayloadSchema } from '../schemas/auth/auth.schemas'
import { verifyToken } from '../services/auth/auth.service'
import { APPLICATION_ERRORS } from '../errors/errors'
import { getCollection } from '../utils/db'
import { COLLECTIONS } from '../config'

/**
 * Express middleware to verify and validate a JWT token.
 *
 * - Checks if the `Authorization` header contains a token.
 * - Verifies the token using `verifyToken`.
 * - Validates the token payload against `TokenPayloadSchema`.
 * - Checks if the token exists in the database for the corresponding user.
 * - Attaches the decoded token payload to `req.body.tokenData` for downstream use.
 * - Calls `next()` if verification succeeds; otherwise, responds with an error.
 *
 * @async
 * @function checkToken
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} Does not return a value; either calls `next()` or sends an error response.
 */
export async function checkToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
      return
    }
    res.status(APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode).json({
      data: { message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message },
    })
  }
}
