import { Router } from 'express'

import {
  deleteScanByIdController,
  updateScanByIdController,
  getAllScansController,
  getScanByIdController,
  scanByUrlController,
} from '../controllers/scan/scan.controller'
import { UpdateScanByIdSchemas } from '../schemas/scans/update-by-id.schema'
import { DeleteScanByIdSchemas } from '../schemas/scans/delete-by-id.schema'
import { GetScanByIdSchemas } from '../schemas/scans/get-by-id.schema'
import { GetAllScansSchemas } from '../schemas/scans/get-all.schema'
import { ScanURLSSchemas } from '../schemas/scans/scan-urls.schema'
import { checkToken } from '../middleware/auth.middleware'
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()

router.get(
  '/list',
  checkToken,
  adaptHandler(getAllScansController, GetAllScansSchemas),
)
router.get(
  '/:id',
  checkToken,
  adaptHandler(getScanByIdController, GetScanByIdSchemas),
)
router.post('/', checkToken, adaptHandler(scanByUrlController, ScanURLSSchemas))
router.put(
  '/:id',
  checkToken,
  adaptHandler(updateScanByIdController, UpdateScanByIdSchemas),
)
router.delete(
  '/:id',
  checkToken,
  adaptHandler(deleteScanByIdController, DeleteScanByIdSchemas),
)

export default router
