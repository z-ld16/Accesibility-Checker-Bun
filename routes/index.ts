import { Router } from 'express'

import scanRoutes from './scan.routes'

const router = Router()

router.use('/scan', scanRoutes)

export default router
