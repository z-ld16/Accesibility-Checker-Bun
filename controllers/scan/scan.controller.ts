import type {
  UpdateScanByIdSchema,
  GetScanByIdSchema,
  ScanURLSSchema,
} from '../../schemas/scan.schemas'
import type { InferFlattened } from '../../types/types'

import { getAllScansServices } from '../../services/scan/get-all.service'
import { deleteScanByIdService } from '../../services/scan/delete-by-id'
import { getScanByIdService } from '../../services/scan/get-by-id'
import { runAccessibilityScan } from '../../services/scan/scan'

export const scanByUrlController = async (
  input: InferFlattened<typeof ScanURLSSchema>,
) => {
  return await runAccessibilityScan(input.urls)
}

export const getAllScansController = async () => {
  return await getAllScansServices()
}

export const getScanByIdController = async (
  input: InferFlattened<typeof GetScanByIdSchema>,
) => {
  return await getScanByIdService(input.id)
}

export const updateScanByIdController = async (
  input: InferFlattened<typeof UpdateScanByIdSchema>,
) => {
  const scan = await getScanByIdService(input.id)
  await runAccessibilityScan([scan.url])
  return { message: 'Scan updated' }
}

export const deleteScanByIdController = async (
  input: InferFlattened<typeof UpdateScanByIdSchema>,
) => {
  await deleteScanByIdService(input.id)
  return { message: 'Scan deleted' }
}
