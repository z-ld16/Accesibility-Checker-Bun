import type { Db } from 'mongodb'

import { beforeAll, afterAll, describe, expect, it } from 'bun:test'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import scanRoutes from '../../src/routes/scan.routes'
import { scanSeeds } from '../utils/seeds/scan-seed'
import { COLLECTIONS } from '../../src/config'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe('GET:/scans/:id', () => {
  let port: number
  let db: Db
  let dispose: () => Promise<void>

  beforeAll(async () => {
    const mockedDB = await mockDB()
    db = mockedDB.db
    await seedDb(db)
    dispose = mockedDB.dispose
    port = await createTestApp(scanRoutes)
  })

  afterAll(async () => {
    await dispose()
  })

  const endpoint = '/scan/'

  it('should return unauthorized cause the token is missing', async () => {
    const result = await fetch(
      buildBasePath(port) + endpoint + scanSeeds[0]?._id,
      { method: 'delete' },
    )
    expect(result.status).toBe(APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode)
    expect(await result.json()).toEqual({
      data: {
        message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message,
      },
    })
  })

  it('should delete scan', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(
      buildBasePath(port) + endpoint + scanSeeds[0]?._id,
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
        method: 'delete',
      },
    )
    expect(result.status).toBe(200)
    expect(await result.json()).toEqual({
      data: {
        message: 'Scan deleted',
      },
    })
    const deletedScan = await db
      .collection(COLLECTIONS.SCANS)
      .findOne({ _id: scanSeeds[0]?._id })
    expect(deletedScan).toBe(null)
  })
})
