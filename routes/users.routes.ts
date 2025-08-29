import { Router } from 'express'

import { createUserController } from '../controllers/users/users.controller'
import { CreateUserSchemas } from '../schemas/users/users.schemas'
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()

router.post('/', adaptHandler(createUserController, CreateUserSchemas))

export default router
