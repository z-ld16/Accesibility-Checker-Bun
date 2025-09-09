import type { Db } from 'mongodb'

import {
  beforeAll,
  afterEach,
  afterAll,
  describe,
  expect,
  spyOn,
  mock,
  it,
} from 'bun:test'
import * as csv from 'csv'

import { APPLICATION_ERRORS } from '../../src/errors/errors'
import { createTestApp } from '../utils/create-test-app'
import { buildBasePath } from '../utils/build-base-path'
import { getValidUser } from '../utils/get-valid-user'
import scanRoutes from '../../src/routes/scan.routes'
import { mockDB } from '../utils/mockDb'
import { seedDb } from '../utils/seedDb'

describe('GET:/scan/list/download', () => {
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

  afterEach(async () => {
    mock.clearAllMocks()
  })

  const endpoint = '/scan/list/download'

  it('should return unauthorized cause the token is missing', async () => {
    const result = await fetch(buildBasePath(port) + endpoint)
    expect(result.status).toBe(APPLICATION_ERRORS.AUTH.TOKEN_MISSING.statusCode)
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.AUTH.TOKEN_MISSING.message,
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
    expect((await result.text()).trim()).toEqual(
      `_id,url,createdAt,updatedAt,violationId,violationImpact,violationDescription
68ae0db703b87ae1f00f6f0a,https://www.google.com,2025-08-26T19:40:39.794Z,2025-08-26T19:40:39.794Z,link-in-text-block,serious,Ensure links are distinguished from surrounding text in a way that does not rely on color
68ae0e1703b87ae1f00f6f0b,https://www.example.com,2025-08-27T10:15:22.123Z,2025-08-27T10:15:22.123Z,color-contrast,moderate,Ensure the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds
68ae0e8a03b87ae1f00f6f0c,https://www.wikipedia.org,2025-08-28T08:30:10.456Z,2025-08-28T08:30:10.456Z,image-alt,critical,Ensure all images have alternate text or a role of none or presentation
68ae0e8a03b87ae1f00f6f0c,https://www.wikipedia.org,2025-08-28T08:30:10.456Z,2025-08-28T08:30:10.456Z,form-label,serious,Ensure every form element has a label
 `.trim(),
    )
    expect(result.status).toBe(200)
  })

  it('should return server error', async () => {
    const validUser = await getValidUser(db)
    spyOn(csv, 'stringify').mockImplementationOnce(() => {
      throw new Error('Mocked stringify error')
    })
    const result = await fetch(
      buildBasePath(port) + endpoint + '?limit=8&offset=0',
      {
        headers: {
          Authorization: `${validUser.token}`,
        },
      },
    )

    expect(result.status).toBe(500)
    expect(await result.json()).toEqual({
      error: {
        message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message,
      },
    })
  })
})
