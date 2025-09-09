import type { Db } from 'mongodb'

import {
  beforeAll,
  afterAll,
  describe,
  expect,
  spyOn,
  jest,
  it,
} from 'bun:test'
import puppeteer from 'puppeteer'

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
  spyOn(puppeteer, 'launch').mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue(undefined),
      addScriptTag: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({
        violations: [
          {
            id: 'color-contrast',
            impact: 'serious',
            description:
              'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
            nodes: [
              {
                html: '<button style="color: #aaa">Click me</button>',
                target: ['button'],
                failureSummary: 'Low contrast',
              },
            ],
          },
        ],
        passes: [],
        incomplete: [],
        inapplicable: [],
      }),
    }),
    close: jest.fn().mockResolvedValue(undefined),
  } as never)

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
      error: {
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
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        url: 'https://www.google.com',
        violations: [
          {
            description:
              'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
            id: 'color-contrast',
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
      error: {
        message: APPLICATION_ERRORS.SCANS.NOT_FOUND_ERROR.message,
      },
    })
  })

  it('should return 500 on an unhandled error', async () => {
    spyOn(puppeteer, 'launch').mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn().mockResolvedValue(undefined),
        addScriptTag: jest.fn().mockResolvedValue(undefined),
        evaluate: jest.fn().mockRejectedValueOnce(new Error('Unhandled error')),
      }),
      close: jest.fn().mockResolvedValue(undefined),
    } as never)
    const validUser = await getValidUser(db)
    db.collection(COLLECTIONS.SCANS).deleteOne({ _id: scanSeeds[0]?._id })
    const result = await fetch(
      buildBasePath(port) + endpoint + scanSeeds[1]?._id,
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
        method: 'put',
      },
    )
    expect(result.status).toBe(
      APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode,
    )
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message,
      },
    })
  })
})
