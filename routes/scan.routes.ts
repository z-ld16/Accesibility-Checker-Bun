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
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()

router.get('/list', adaptHandler(getAllScansController, GetAllScansSchemas))
router.get('/:id', adaptHandler(getScanByIdController, GetScanByIdSchemas))
router.post('/', adaptHandler(scanByUrlController, ScanURLSSchemas))
router.put(
  '/:id',
  adaptHandler(updateScanByIdController, UpdateScanByIdSchemas),
)
router.delete(
  '/:id',
  adaptHandler(deleteScanByIdController, DeleteScanByIdSchemas),
)

export default router
