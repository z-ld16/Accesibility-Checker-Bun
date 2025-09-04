import type { UpdateScanByIdSchemas } from '../../schemas/scans/update-by-id.schema'
import type { DeleteScanByIdSchemas } from '../../schemas/scans/delete-by-id.schema'
import type { ScanURLSSchemas } from '../../schemas/scans/scan-urls.schema'
import type { InferFlattened } from '../../types/types'

import { exportScansCSVService } from '../../services/scan/export-scans.service'
import { GetScanByIdSchemas } from '../../schemas/scans/get-by-id.schema'
import { getAllScansServices } from '../../services/scan/get-all.service'
import { deleteScanByIdService } from '../../services/scan/delete-by-id'
import { GetAllScansSchemas } from '../../schemas/scans/get-all.schema'
import { getScanByIdService } from '../../services/scan/get-by-id'
import { runAccessibilityScan } from '../../services/scan/scan'
import { parseOutput } from '../../utils/parser.utils'
import { paginate } from '../../utils/pagination'
import { ok } from '../../utils/http-responses'

export const scanByUrlController = async (
  input: InferFlattened<typeof ScanURLSSchemas.request>,
) => {
  // TODO: add schema verification
  return ok({ data: await runAccessibilityScan(input.urls) })
}

export const getAllScansController = async ({
  limit,
  offset,
}: InferFlattened<typeof GetAllScansSchemas.request>) => {
  const { scans, count } = await getAllScansServices(limit, offset)
  const paginatedData = paginate(scans, count, limit, offset)
  return ok(parseOutput(paginatedData, GetAllScansSchemas.response))
}

export const getScanByIdController = async (
  input: InferFlattened<typeof GetScanByIdSchemas.request>,
) => {
  const scan = await getScanByIdService(input.id)
  return ok(
    GetScanByIdSchemas.response.strip().parse({
      data: scan,
    }),
  )
}

export const updateScanByIdController = async (
  input: InferFlattened<typeof UpdateScanByIdSchemas.request>,
) => {
  const scan = await getScanByIdService(input.id)
  await runAccessibilityScan([scan.url])
  const updatedScan = await getScanByIdService(input.id)
  return ok(
    GetScanByIdSchemas.response.strip().parse({
      data: updatedScan,
    }),
  )
}

export const deleteScanByIdController = async (
  input: InferFlattened<typeof DeleteScanByIdSchemas.request>,
) => {
  await deleteScanByIdService(input.id)
  return ok({ data: { message: 'Scan deleted' } })
}

export const exportScansController = async () => {
  return await exportScansCSVService()
}
