import type { Db } from 'mongodb'

import { beforeAll, afterAll, describe, expect, it } from 'bun:test'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import authRoutes from '../../src/routes/auth.routes'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe.only('POST:/auth/logout', () => {
  let port: number
  let db: Db
  let dispose: () => Promise<void>

  beforeAll(async () => {
    const mockedDB = await mockDB()
    db = mockedDB.db
    await seedDb(db)
    dispose = mockedDB.dispose
    port = await createTestApp(authRoutes)
  })

  afterAll(async () => {
    await dispose()
  })

  const endpoint = '/auth/logout'

  it('should return missing Authorization', async () => {
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
    })
    expect(await result.json()).toEqual({
      error: { message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message },
    })
    expect(result.status).toEqual(
      APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode,
    )
  })

  it('should finish successfully', async () => {
    const validUser = await getValidUser(db)
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: {
        Authorization: `${validUser.token}`,
      },
    })
    expect(await result.json()).toEqual({
      data: { message: 'Logged out successfully' },
    })
    expect(result.status).toEqual(200)
  })
})
