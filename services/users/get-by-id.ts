import type { CreateUserSchemas } from '../../schemas/users/users.schemas'
import type { InferFlattened, Users } from '../../types/types'

import { UsernameAlreadyExistsError } from '../../errors/users-services.errors'
import { NotFoundError } from '../../errors/http.errors'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function createUserService({
  username,
  password,
}: InferFlattened<typeof CreateUserSchemas.request>) {
  const users = await getCollection<Users>(COLLECTIONS.USERS)

  if (!users) {
    throw new NotFoundError()
  }

  const usernameExists = await users.findOne({ username })

  if (usernameExists?._id) {
    throw new UsernameAlreadyExistsError('The chosen username already exists.')
  }

  const { insertedId } = await users.insertOne({
    username,
    password: Bun.password.hashSync(password, 'bcrypt'),
  })

  const user = await users.findOne({ _id: insertedId })

  return user
}
