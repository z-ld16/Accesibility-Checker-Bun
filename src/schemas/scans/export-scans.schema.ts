import Readable from 'node:stream'
import z from 'zod/v4'

const ExportScansResponseSchema = z.object({
  data: z.instanceof(Readable),
})

export const ExportScansSchemas = {
  response: ExportScansResponseSchema,
}
