import type { CreateUserSchemas } from '../../schemas/users/users.schemas'
import type { InferFlattened } from '../../types/types'

import { InvalidPasswordError } from '../../errors/users-services.errors'
import { generateToken } from '../auth/auth.service'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function loginUserService({
  username,
  password,
}: InferFlattened<typeof CreateUserSchemas.request>) {
  const users = await getCollection(COLLECTIONS.USERS)

  const user = await users.findOne({ username })

  if (!user) {
    throw new InvalidPasswordError('Invalid password or user doesnt exists')
  }

  const validPassword = Bun.password.verify(password, user.password)

  if (!validPassword) {
    throw new InvalidPasswordError('Invalid password or user doesnt exists')
  }

  const token = generateToken(user._id.toString())

  return token
}
