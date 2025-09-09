import type { Db } from 'mongodb'

import { beforeAll, afterAll, describe, expect, it } from 'bun:test'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import scanRoutes from '../../src/routes/scan.routes'
import { COLLECTIONS } from '../../src/config'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe('GET:/scan/list', () => {
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

  const endpoint = '/scan/list'

  it('should return unauthorized cause the token is missing', async () => {
    const result = await fetch(buildBasePath(port) + endpoint)
    expect(result.status).toBe(APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode)
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message,
      },
    })
  })

  it('should return bad request error, missing limit and offset', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(buildBasePath(port) + endpoint, {
      headers: {
        Authorization: `${validUser.token}`,
      },
    })
    expect(result.status).toBe(
      APPLICATION_ERRORS.GENERIC.INVALID_INPUT.statusCode,
    )
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.GENERIC.INVALID_INPUT.message,
        stack: {
          _errors: [],
          query: {
            _errors: [],
            limit: {
              _errors: ['Invalid input: expected string, received undefined'],
            },
            offset: {
              _errors: ['Invalid input: expected string, received undefined'],
            },
          },
        },
      },
    })
  })

  it('should return scans', async () => {
    const validUser = await getValidUser(db)
    const result = await fetch(
      buildBasePath(port) + endpoint + '?limit=8&offset=0',
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
      },
    )
    expect(await result.json()).toEqual({
      data: [
        {
          _id: '68ae0db703b87ae1f00f6f0a',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
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
        {
          _id: '68ae0e1703b87ae1f00f6f0b',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url: 'https://www.example.com',
          violations: [
            {
              description:
                'Ensure the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
              id: 'color-contrast',
              impact: 'moderate',
            },
          ],
        },
        {
          _id: '68ae0e8a03b87ae1f00f6f0c',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url: 'https://www.wikipedia.org',
          violations: [
            {
              description:
                'Ensure all images have alternate text or a role of none or presentation',
              id: 'image-alt',
              impact: 'critical',
            },
            {
              description: 'Ensure every form element has a label',
              id: 'form-label',
              impact: 'serious',
            },
          ],
        },
      ],
      pageInfo: {
        currentPage: 1,
        pages: 1,
      },
    })
    expect(result.status).toBe(200)
  })

  it('should return scans', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(
      buildBasePath(port) + endpoint + '?limit=8&offset=0',
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
      },
    )

    expect(await result.json()).toEqual({
      data: [
        {
          _id: '68ae0db703b87ae1f00f6f0a',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
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
        {
          _id: '68ae0e1703b87ae1f00f6f0b',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url: 'https://www.example.com',
          violations: [
            {
              description:
                'Ensure the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
              id: 'color-contrast',
              impact: 'moderate',
            },
          ],
        },
        {
          _id: '68ae0e8a03b87ae1f00f6f0c',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url: 'https://www.wikipedia.org',
          violations: [
            {
              description:
                'Ensure all images have alternate text or a role of none or presentation',
              id: 'image-alt',
              impact: 'critical',
            },
            {
              description: 'Ensure every form element has a label',
              id: 'form-label',
              impact: 'serious',
            },
          ],
        },
      ],
      pageInfo: {
        currentPage: 1,
        pages: 1,
      },
    })
    expect(result.status).toBe(200)
  })

  it('should return empty array', async () => {
    db.collection(COLLECTIONS.SCANS).deleteMany({})
    const validUser = await getValidUser(db)

    const result = await fetch(
      buildBasePath(port) + endpoint + '?limit=8&offset=0',
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
      },
    )

    expect(await result.json()).toEqual({
      data: [],
      pageInfo: {
        currentPage: 1,
        pages: 1,
      },
    })
    expect(result.status).toBe(200)
  })
})
