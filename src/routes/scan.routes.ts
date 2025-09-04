import { Router } from 'express'

import {
  deleteScanByIdController,
  updateScanByIdController,
  getAllScansController,
  getScanByIdController,
  exportScansController,
  scanByUrlController,
} from '../controllers/scan/scan.controller'
import { UpdateScanByIdSchemas } from '../schemas/scans/update-by-id.schema'
import { DeleteScanByIdSchemas } from '../schemas/scans/delete-by-id.schema'
import { ExportScansSchemas } from '../schemas/scans/export-scans.schema'
import { GetScanByIdSchemas } from '../schemas/scans/get-by-id.schema'
import { GetAllScansSchemas } from '../schemas/scans/get-all.schema'
import { ScanURLSSchemas } from '../schemas/scans/scan-urls.schema'
import { adaptStreamHandler } from '../utils/stream-adapter'
import { checkToken } from '../middleware/auth.middleware'
import { adaptHandler } from '../utils/handler-adapter'

const router = Router()

router.get(
  '/scan/list',
  checkToken,
  adaptHandler(getAllScansController, GetAllScansSchemas),
)
router.get(
  '/scan/list/download',
  checkToken,
  adaptStreamHandler(exportScansController, ExportScansSchemas),
)
router.get(
  '/scan/:id',
  checkToken,
  adaptHandler(getScanByIdController, GetScanByIdSchemas),
)
router.post(
  '/scan',
  checkToken,
  adaptHandler(scanByUrlController, ScanURLSSchemas),
)
router.put(
  '/scan/:id',
  checkToken,
  adaptHandler(updateScanByIdController, UpdateScanByIdSchemas),
)
router.delete(
  '/scan/:id',
  checkToken,
  adaptHandler(deleteScanByIdController, DeleteScanByIdSchemas),
)

export default router
