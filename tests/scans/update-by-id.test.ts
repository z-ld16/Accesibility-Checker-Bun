import type { Db } from 'mongodb'

import { beforeAll, afterAll, describe, expect, jest, it } from 'bun:test'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import scanRoutes from '../../src/routes/scan.routes'
import { scanSeeds } from '../utils/seeds/scan-seed'
import { COLLECTIONS } from '../../src/config'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe('PUT:/scan/:id', () => {
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
      {
        method: 'put',
      },
    )
    expect(result.status).toBe(APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode)
    expect(await result.json()).toEqual({
      data: {
        message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message,
      },
    })
  })

  it('should update scan', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(
      buildBasePath(port) + endpoint + scanSeeds[0]?._id,
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
        method: 'put',
      },
    )
    expect(result.status).toBe(200)
    expect(await result.json()).toEqual({
      data: {
        _id: '68ae0db703b87ae1f00f6f0a',
        createdAt: '2025-08-26T19:40:39.794Z',
        updatedAt: '2025-08-26T19:40:39.794Z',
        url: 'https://www.google.com',
        violations: [
          {
            description:
              'Ensure links are distinguished from surrounding text in a way that does not rely on color',
            id: 'link-in-text-block',
            impact: 'serious',
          },
        ],
      },
    })
  })

  it('should return not found', async () => {
    const validUser = await getValidUser(db)
    db.collection(COLLECTIONS.SCANS).deleteOne({ _id: scanSeeds[0]?._id })
    const result = await fetch(
      buildBasePath(port) + endpoint + scanSeeds[0]?._id,
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
        method: 'put',
      },
    )
    expect(result.status).toBe(
      APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR.statusCode,
    )
    expect(await result.json()).toEqual({
      data: {
        message: APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR.message,
      },
    })
  })
})
