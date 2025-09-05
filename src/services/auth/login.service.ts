import type { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import type { InferFlattened, Users } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { generateToken } from '../auth/auth.service'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function loginUserService({
  username,
  password,
}: InferFlattened<typeof LoginUserSchemas.request>) {
  const users = await getCollection<Users>(COLLECTIONS.USERS)

  const user = await users.findOne({ username })

  if (!user) {
    throwError(APPLICATION_ERRORS.USERS.WRONG_PASSWORD)
  }

  const validPassword = Bun.password.verifySync(password, user.password)

  if (!validPassword) {
    throwError(APPLICATION_ERRORS.USERS.WRONG_PASSWORD)
  }

  const token = await generateToken(user._id.toHexString())

  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        token,
      },
    },
  )

  return token
}
