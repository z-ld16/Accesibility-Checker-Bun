import type { Router } from 'express'

import express from 'express'

export async function createTestApp(routes: Router) {
  const app = express()
  app.use(express.json())

  app.use('/api', routes)
  const server = app.listen(0)
  const addr = server.address()
  if (!addr) {
    throw new Error('Server not online')
  }
  if (typeof addr === 'string') {
    throw new Error('Server not online')
  }

  return addr.port
}
