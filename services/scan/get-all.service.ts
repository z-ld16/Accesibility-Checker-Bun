import { mongoConnect } from '../db/mongo-connect'

export const getAllScansServices = async () => {
  const db = await mongoConnect()

  const scans = db?.collection('scans')

  return scans?.find().toArray()
}
