import { Router } from 'express'

import usersRoutes from './users.routes'
import scanRoutes from './scan.routes'

const router = Router()

router.use('/scan', scanRoutes)
router.use('/users', usersRoutes)

export default router
