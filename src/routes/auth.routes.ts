import { Router } from 'express'

import { logoutUserController } from '../controllers/auth/logout.controller'
import { loginUserController } from '../controllers/auth/login.controller'
import { LoginUserSchemas } from '../schemas/users/login-user.schema'
import { LogoutUserSchemas } from '../schemas/users/logout.schema'
import { checkToken } from '../middleware/auth.middleware'
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()
router.post('/login', adaptHandler(loginUserController, LoginUserSchemas))
router.post(
  '/logout',
  checkToken,
  adaptHandler(logoutUserController, LogoutUserSchemas),
)

export default router
