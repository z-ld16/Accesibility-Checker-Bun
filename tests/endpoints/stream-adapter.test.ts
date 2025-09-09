import type { Response, Request } from 'express'

import { expect, test, mock } from 'bun:test'
import { Readable } from 'node:stream'

import { adaptStreamHandler } from '../../src/utils/stream-adapter'
import { APPLICATION_ERRORS } from '../../src/errors/errors'

test('handles stream error before headers are sent', async () => {
  // fake stream
  const fakeStream = new Readable({ read() { } })

  // controller that returns our fake stream
  const controller = mock(() => Promise.resolve(fakeStream))

  // mock response
  const res = {
    headersSent: false,
    setHeader: mock(),
    status: mock(() => res),
    json: mock(),
    on: mock(),
  } as unknown as Response

  const handler = adaptStreamHandler(controller, { response: {} })

  await handler({} as Request, res)

  // emit error AFTER handler attached error listener
  fakeStream.emit('error', new Error('boom'))

  expect(res.status).toHaveBeenCalledWith(
    APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.statusCode,
  )
  expect(res.json).toHaveBeenCalledWith({
    data: { message: APPLICATION_ERRORS.GENERIC.UNHANDLED_ERROR.message },
  })
})

test('destroys response if headers already sent', async () => {
  const fakeStream = new Readable({ read() { } })
  const controller = mock(() => Promise.resolve(fakeStream))

  const destroySpy = mock()

  const res = {
    headersSent: true,
    setHeader: mock(),
    on: mock(),
    destroy: destroySpy,
    status: mock(() => res),
    json: mock(),
  } as unknown as Response

  const handler = adaptStreamHandler(controller, { response: {} })
  await handler({} as Request, res)

  fakeStream.emit('error', new Error('oops'))

  expect(destroySpy).toHaveBeenCalledWith(expect.any(Error))
})
