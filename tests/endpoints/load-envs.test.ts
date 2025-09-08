import { beforeEach, afterEach, describe, expect, jest, it } from 'bun:test'

import { loadEnv } from '../../src/config/environment-variables'

const OLD_EXIT = process.exit
const OLD_ENV = process.env

const requiredVars = [
  'MONGO_URI',
  'PORT',
  'JWT_SECRET',
  'DB_NAME',
  'JWT_EXPIRES_IN_SECONDS',
]

describe('loadEnv (integration)', () => {
  beforeEach(() => {
    process.env = {}
    process.exit = jest.fn(((code?: number) => {
      throw new Error(`process.exit: ${code}`)
    }) as never)
  })

  afterEach(() => {
    process.env = OLD_ENV
    process.exit = OLD_EXIT
  })

  it('returns parsed env when all required vars are present', () => {
    for (const envVariable of requiredVars) {
      process.env[envVariable] = envVariable + 'test'
    }

    // TODO: this is kinda hacky should be better
    process.env.PORT = '3000'
    process.env.JWT_EXPIRES_IN_SECONDS = '86400'

    const result = loadEnv()

    expect(result).toMatchObject({
      DB_NAME: 'DB_NAMEtest',
      JWT_EXPIRES_IN_SECONDS: 86400,
      JWT_SECRET: 'JWT_SECRETtest',
      MONGO_URI: 'MONGO_URItest',
      PORT: 3000,
    })
  })

  it('exits when a required variable is missing', () => {
    process.env.FOO = 'foo'
    delete process.env.BAR

    expect(() => loadEnv()).toThrow('process.exit: 1')
  })

  it('treats empty string as missing', () => {
    process.env.FOO = ''
    process.env.BAR = 'bar'

    expect(() => loadEnv()).toThrow('process.exit: 1')
  })
})
