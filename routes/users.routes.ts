import { Router } from 'express'

import {
  createUserController,
  loginUserController,
} from '../controllers/users/users.controller'
import { LoginUserSchemas } from '../schemas/users/login-user.schema'
import { CreateUserSchemas } from '../schemas/users/users.schemas'
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()

router.post('/', adaptHandler(createUserController, CreateUserSchemas))
router.post('/login', adaptHandler(loginUserController, LoginUserSchemas))

export default router
