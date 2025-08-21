import { mongoConnect } from '../db/mongo-connect'

export const getAllScansServices = async () => {
  const db = await mongoConnect()

  const scans = db?.collection('scans')

  return await scans?.find().toArray()
}
