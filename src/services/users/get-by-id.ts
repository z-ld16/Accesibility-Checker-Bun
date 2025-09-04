import type { CreateUserSchemas } from '../../schemas/users/users.schemas'
import type { InferFlattened, Users } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function createUserService({
  username,
  password,
}: InferFlattened<typeof CreateUserSchemas.request>) {
  const users = await getCollection<Users>(COLLECTIONS.USERS)

  const usernameExists = await users.findOne({ username })

  if (usernameExists?._id) {
    throwError(APPLICATION_ERRORS.USERS.USERNAME_FOUND)
  }

  const { insertedId } = await users.insertOne({
    username,
    password: Bun.password.hashSync(password, 'bcrypt'),
  })

  return await users.findOne({ _id: insertedId })
}
