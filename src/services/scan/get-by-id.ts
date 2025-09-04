import type { ObjectId } from 'mongodb'

import type { Scans } from '../../types/types'

import { APPLICATION_ERRORS } from '../../errors/errors'
import { throwError } from '../../utils/errors.utils'
import { getCollection } from '../../utils/db'
import { COLLECTIONS } from '../../config'

export async function getScanByIdService(id: ObjectId) {
  const scans = await getCollection<Scans>(COLLECTIONS.SCANS)
  const scan = await scans.findOne({ _id: id })

  if (!scan) {
    throwError(APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR)
  }

  return scan
}
