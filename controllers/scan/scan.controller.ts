import { ZodError } from 'zod'

import type { UpdateScanByIdSchemas } from '../../schemas/scans/update-by-id.schema'
import type { DeleteScanByIdSchemas } from '../../schemas/scans/delete-by-id.schema'
import type { ScanURLSSchemas } from '../../schemas/scans/scan-urls.schema'
import type { InferFlattened } from '../../types/types'

import { GetScanByIdSchemas } from '../../schemas/scans/get-by-id.schema'
import { getAllScansServices } from '../../services/scan/get-all.service'
import { deleteScanByIdService } from '../../services/scan/delete-by-id'
import { GetAllScansSchemas } from '../../schemas/scans/get-all.schema'
import { serverError, notFound, ok } from '../../utils/http-responses'
import { NotFoundError, ServerError } from '../../errors/http.errors'
import { getScanByIdService } from '../../services/scan/get-by-id'
import { runAccessibilityScan } from '../../services/scan/scan'
import { paginate } from '../../utils/pagination'

export const scanByUrlController = async (
  input: InferFlattened<typeof ScanURLSSchemas.request>,
) => {
  return ok(await runAccessibilityScan(input.urls))
}

export const getAllScansController = async ({
  limit,
  offset,
}: InferFlattened<typeof GetAllScansSchemas.request>) => {
  try {
    const { scans, count } = await getAllScansServices(limit, offset)
    return ok(
      GetAllScansSchemas.response
        .strip()
        .parse(paginate(scans, count, limit, offset)),
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound(new Error('Scan not found'))
    }
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}

export const getScanByIdController = async (
  input: InferFlattened<typeof GetScanByIdSchemas.request>,
) => {
  try {
    const scan = await getScanByIdService(input.id)
    return ok(
      GetScanByIdSchemas.response.strip().parse({
        data: scan,
      }),
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound(new Error('Scan not found'))
    }
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}

export const updateScanByIdController = async (
  input: InferFlattened<typeof UpdateScanByIdSchemas.request>,
) => {
  try {
    const scan = await getScanByIdService(input.id)
    await runAccessibilityScan([scan.url])
    const updatedScan = await getScanByIdService(input.id)
    return ok(
      GetScanByIdSchemas.response.strip().parse({
        data: updatedScan,
      }),
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound(new Error('Scan not found'))
    }
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}

export const deleteScanByIdController = async (
  input: InferFlattened<typeof DeleteScanByIdSchemas.request>,
) => {
  try {
    await deleteScanByIdService(input.id)
    return ok({ data: { message: 'Scan deleted' } })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFound(new Error('Scan not found'))
    }
    if (error instanceof ZodError) {
      return serverError(new ServerError())
    }
    throw error
  }
}
