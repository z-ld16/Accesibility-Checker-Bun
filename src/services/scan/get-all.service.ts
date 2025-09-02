import { CouldntGetCountError } from '../../errors/services.errors'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export const getAllScansServices = async (limit: number, offset: number) => {
  const scans = await getCollection(COLLECTIONS.SCANS)
  const count = await scans?.countDocuments()

  if (!count) {
    throw new CouldntGetCountError('Couldnt get count error')
  }

  return {
    scans: await scans?.find().skip(offset).limit(limit).toArray(),
    count,
  }
}
