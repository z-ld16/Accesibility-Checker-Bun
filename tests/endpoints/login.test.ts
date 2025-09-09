import type { Db } from 'mongodb'

import { beforeAll, afterAll, describe, expect, it } from 'bun:test'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import authRoutes from '../../src/routes/auth.routes'
import { COLLECTIONS } from '../../src/config'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe.only('POST:/auth/login', () => {
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

  const endpoint = '/auth/login'

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

  it('should return error cause the user doesnt exist', async () => {
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'pepe',
        password: 'ValidPass123!!',
      }),
    })
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.AUTH.WRONG_PASSWORD.message,
      },
    })

    expect(result.status).toEqual(400)
  })

  it('should return error cause the password is not correct', async () => {
    const validUser = await getValidUser(db)
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: validUser.username,
        password: 'InvalidPass123!!',
      }),
    })
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.AUTH.WRONG_PASSWORD.message,
      },
    })

    expect(result.status).toEqual(400)
  })

  it('should return token and update user', async () => {
    const validUser = await getValidUser(db)
    const userBeforeLogin = await db
      .collection(COLLECTIONS.USERS)
      .findOne({ _id: validUser._id })

    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: validUser.username,
        password: 'ValidPass123!!',
      }),
    })
    expect(await result.json()).toEqual({
      data: {
        token: expect.stringMatching(jwtRegex),
      },
    })
    const userAfterLogin = await db
      .collection(COLLECTIONS.USERS)
      .findOne({ _id: validUser._id })

    expect(userBeforeLogin?.token).not.toEqual(userAfterLogin?.token)
  })
})
