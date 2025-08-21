import { Router } from 'express'

import {
  deleteScanByIdController,
  updateScanByIdController,
  getAllScansController,
  getScanByIdController,
  scanByUrlController,
} from '../controllers/scan/scan.controller'
import {
  DeleteScanByIdSchema,
  UpdateScanByIdSchema,
  GetScanByIdSchema,
  ScanURLSSchema,
} from '../schemas/scan.schemas'
import { adaptHandler } from '../utils/handlerAdapter'

const router = Router()

router.get('/list', adaptHandler(getAllScansController))
router.get('/:id', adaptHandler(getScanByIdController, GetScanByIdSchema))
router.post('/', adaptHandler(scanByUrlController, ScanURLSSchema))
router.put('/:id', adaptHandler(updateScanByIdController, UpdateScanByIdSchema))
router.delete(
  '/:id',
  adaptHandler(deleteScanByIdController, DeleteScanByIdSchema),
)

export default router
