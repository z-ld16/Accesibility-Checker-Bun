import consola from 'consola'

import type { LoginUserSchemas } from '../../schemas/users/login-user.schema'
import type { InferFlattened, Users } from '../../types/types'

import { InvalidPasswordError } from '../../errors/users-services.errors'
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
    throw new InvalidPasswordError('Invalid password or user doesnt exists')
  }

  const validPassword = Bun.password.verify(password, user.password)

  if (!validPassword) {
    throw new InvalidPasswordError('Invalid password or user doesnt exists')
  }

  consola.log(user._id.toHexString())
  const token = await generateToken(user._id.toHexString())

  users.updateOne(
    { _id: user._id },
    {
      $set: {
        token,
      },
    },
  )

  return token
}
