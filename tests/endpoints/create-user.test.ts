import { beforeAll, afterAll, describe, expect, it } from 'bun:test'
import { type Db } from 'mongodb'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import usersRoutes from '../../src/routes/users.routes'
import { getValidUser } from '../utils/get-valid-user'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe.only('POST:/users', () => {
  let port: number
  let db: Db
  let dispose: () => Promise<void>

  beforeAll(async () => {
    const mockedDB = await mockDB()
    db = mockedDB.db
    await seedDb(db)
    dispose = mockedDB.dispose
    port = await createTestApp(usersRoutes)
  })

  afterAll(async () => {
    await dispose()
  })

  const endpoint = '/users'

  it('should return bad request on empty body', async () => {
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(await result.json()).toEqual({
      error: {
        message: 'Input is invalid',
        stack: {
          _errors: [],
          body: {
            _errors: [],
            password: {
              _errors: ['Invalid input: expected string, received undefined'],
            },
            username: {
              _errors: ['Invalid input: expected string, received undefined'],
            },
          },
        },
      },
    })
    expect(result.status).toEqual(
      APPLICATION_ERRORS.GENERIC.INVALID_INPUT.statusCode,
    )
  })

  it('should return bad request on existing username', async () => {
    const validUser = await getValidUser(db)
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: validUser.username,
        password: 'Hola123!',
      }),
    })
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.USERS.USERNAME_FOUND.message,
      },
    })
    expect(result.status).toEqual(
      APPLICATION_ERRORS.USERS.USERNAME_FOUND.statusCode,
    )
  })

  it('should return user upon successful creation', async () => {
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'newUser',
        password: 'Hola123!',
      }),
    })
    expect(await result.json()).toEqual({
      data: {
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        username: 'newUser',
      },
    })
    expect(result.status).toEqual(200)
  })
})
