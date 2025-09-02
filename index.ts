import express from 'express'
import consola from 'consola'

import { loadEnv } from './src/config/environment-variables.ts'
import routes from './src/routes/index.ts'

const app = express()
app.use(express.json())
app.use('/api', routes)
const { PORT } = loadEnv()

app.listen(PORT, () => {
  consola.log(`Listening on port ${PORT}...`)
})
