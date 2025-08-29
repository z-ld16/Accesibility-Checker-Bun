import { ObjectId } from 'mongodb'

import type { LogoutUserSchemas } from '../../schemas/users/logout.schema'
import type { InferFlattened } from '../../types/types'

import { InvalidPasswordError } from '../../errors/users-services.errors'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function logoutUserService({
  tokenData,
}: InferFlattened<typeof LogoutUserSchemas.request>) {
  const users = await getCollection(COLLECTIONS.USERS)

  const user = await users.findOne({ _id: new ObjectId(tokenData.userId) })

  if (!user) {
    throw new InvalidPasswordError('Invalid password or user doesnt exists')
  }

  users.updateOne(
    { _id: user._id },
    {
      $set: {
        token: '',
      },
    },
  )
}
