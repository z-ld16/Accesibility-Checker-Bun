export const APPLICATION_ERRORS = {
  GENERIC: {
    INVALID_INPUT: {
      message: 'Input is invalid',
      statusCode: 400,
    },
    INVALID_OUTPUT: {
      message: 'Server Error',
      debugMessage: 'Output is invalid',
      statusCode: 500,
    },
    UNHANDLED_ERROR: {
      message: 'Server Error',
      debugMessage: 'Unhandled error',
      statusCode: 500,
    },
    DB_ERROR: {
      message: 'Server Error',
      debugMessage: 'Cannot connect to db',
      statusCode: 500,
    },
  },
  SCANS: {
    GENERIC_ERROR: {
      message: 'An error occurred',
      statusCode: 500,
    },
    INSUFFICIENT_PERMISSION: {
      message: 'Insufficient permission',
      statusCode: 403,
    },
    NOT_FOUND_ERROR: {
      message: 'Scan has not been found',
      statusCode: 404,
    },
  },
  USERS: {
    USERNAME_FOUND: {
      message: 'Username already exist',
      statusCode: 400,
    },
    WRONG_PASSWORD: {
      message: 'Username or password are not correct, please try again',
      statusCode: 400,
    },
    NOT_FOUND: {
      message: 'User not found',
      statusCode: 404,
    },
  },
  AUTH: {
    TOKEN_MISSING: {
      message: 'Missing authorization',
      debugMessage: 'Token is missing',
      statusCode: 401,
    },
    TOKEN_EXPIRED: {
      message: 'Missing authorization',
      debugMessage: 'Token is expired',
      statusCode: 401,
    },
    WRONG_PASSWORD: {
      message: 'Username or password are not correct, please try again',
      statusCode: 400,
    },
    DB_TOKEN_NOT_FOUND: {
      message: 'Insufficient permission',
      debugMessage: 'Token missing in DB',
      statusCode: 403,
    },
  },
}
