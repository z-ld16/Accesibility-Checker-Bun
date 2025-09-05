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
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe('POST:/scan', () => {
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

  const endpoint = '/scan'

  it('should return unauthorized cause the token is missing', async () => {
    const result = await fetch(buildBasePath(port) + endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: ['www.google.com'],
      }),
    })
    expect(result.status).toBe(APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode)
    expect(await result.json()).toEqual({
      data: {
        message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message,
      },
    })
  })

  it('should throw error due to bad url formatting', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(buildBasePath(port) + endpoint, {
      headers: {
        Authorization: `${validUser.token}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({
        urls: ['www.google.com'],
      }),
    })
    expect(await result.json()).toEqual({
      data: {
        message: 'Input is invalid',
        stack: {
          _errors: [],
          body: {
            _errors: [],
            urls: {
              '0': {
                _errors: ['Invalid HTTP/HTTPS URL'],
              },
              _errors: [],
            },
          },
        },
      },
    })
    expect(result.status).toBe(400)
  })

  it('should run scan', async () => {
    const validUser = await getValidUser(db)

    const result = await fetch(buildBasePath(port) + endpoint, {
      headers: {
        Authorization: `${validUser.token}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({
        urls: ['https://www.google.com'],
      }),
    })
    expect(await result.json()).toEqual({
      data: {
        message: 'Scan ran successfully',
      },
    })

    expect(result.status).toBe(200)
  })
})
