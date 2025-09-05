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

/**
 * Runs an accessibility scan for the given URLs.
 *
 * @async
 * @function scanByUrlController
 * @param {InferFlattened<typeof ScanURLSSchemas.request>} input - The validated request object containing URLs to scan.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing the scan results.
 */
export const scanByUrlController = async (
  input: InferFlattened<typeof ScanURLSSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  // TODO: add schema verification
  return ok({ data: await runAccessibilityScan(input.urls) })
}

/**
 * Retrieves a paginated list of scans.
 *
 * @async
 * @function getAllScansController
 * @param {InferFlattened<typeof GetAllScansSchemas.request>} params - Pagination parameters (limit, offset).
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing paginated scan data.
 */
export const getAllScansController = async ({
  limit,
  offset,
}: InferFlattened<typeof GetAllScansSchemas.request>): Promise<
  ReturnType<typeof ok>
> => {
  const { scans, count } = await getAllScansServices(limit, offset)
  const paginatedData = paginate(scans, count, limit, offset)
  return ok(parseOutput(paginatedData, GetAllScansSchemas.response))
}

/**
 * Retrieves a single scan by its ID.
 *
 * @async
 * @function getScanByIdController
 * @param {InferFlattened<typeof GetScanByIdSchemas.request>} input - The request object containing the scan ID.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing the requested scan.
 */
export const getScanByIdController = async (
  input: InferFlattened<typeof GetScanByIdSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  const scan = await getScanByIdService(input.id)
  return ok(
    GetScanByIdSchemas.response.strip().parse({
      data: scan,
    }),
  )
}

/**
 * Updates (re-runs) a scan by its ID.
 *
 * @async
 * @function updateScanByIdController
 * @param {InferFlattened<typeof UpdateScanByIdSchemas.request>} input - The request object containing the scan ID.
 * @returns {Promise<ReturnType<typeof ok>>} A response object containing the updated scan.
 */
export const updateScanByIdController = async (
  input: InferFlattened<typeof UpdateScanByIdSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  const scan = await getScanByIdService(input.id)
  await runAccessibilityScan([scan.url])
  const updatedScan = await getScanByIdService(input.id)
  return ok(
    GetScanByIdSchemas.response.strip().parse({
      data: updatedScan,
    }),
  )
}

/**
 * Deletes a scan by its ID.
 *
 * @async
 * @function deleteScanByIdController
 * @param {InferFlattened<typeof DeleteScanByIdSchemas.request>} input - The request object containing the scan ID.
 * @returns {Promise<ReturnType<typeof ok>>} A response object confirming deletion.
 */
export const deleteScanByIdController = async (
  input: InferFlattened<typeof DeleteScanByIdSchemas.request>,
): Promise<ReturnType<typeof ok>> => {
  await deleteScanByIdService(input.id)
  return ok({ data: { message: 'Scan deleted' } })
}

/**
 * Exports all scans as a CSV file.
 *
 * @async
 * @function exportScansController
 * @returns {Promise<unknown>} The exported CSV data.
 */
export const exportScansController = async (): Promise<unknown> => {
  return await exportScansCSVService()
}
