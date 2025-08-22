import express from 'express'
import consola from 'consola'

import { PORT } from './config/index.ts'
import routes from './routes/index.ts'

const app = express()
app.use(express.json())

app.use('/api', routes)

app.listen(PORT, () => {
  consola.log(`Listening on port ${PORT}...`)
})
