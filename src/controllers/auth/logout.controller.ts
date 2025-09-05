import type { InferFlattened } from '../../types/types'

import { logoutUserService } from '../../services/auth/logout.service'
import { LogoutUserSchemas } from '../../schemas/users/logout.schema'
import { ok } from '../../utils/http-responses'

export const logoutUserController = async (
  input: InferFlattened<typeof LogoutUserSchemas.request>,
) => {
  await logoutUserService(input)
  return ok(
    LogoutUserSchemas.response.strip().parse({
      data: {
        message: 'Logged out successfully',
      },
    }),
  )
}
