import { CouldntGetCountError } from '../../errors/services.errors'
import { mongoConnect } from '../db/mongo-connect'

export const getAllScansServices = async (limit: number, offset: number) => {
  const db = await mongoConnect()

  const scans = db?.collection('scans')
  const count = await scans?.countDocuments()

  if (!count) {
    throw new CouldntGetCountError('Couldnt get count error')
  }

  return {
    scans: await scans?.find().skip(offset).limit(limit).toArray(),
    count,
  }
}
