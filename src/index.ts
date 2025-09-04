import express from 'express'
import consola from 'consola'

import { loadEnv } from './config/environment-variables.ts'
import usersRoutes from './routes/users.routes.ts'
import scanRoutes from './routes/scan.routes.ts'
import authRoutes from './routes/auth.routes.ts'

const { PORT } = loadEnv()
const app = express()
app.use(express.json())
app.use('/api', [usersRoutes, scanRoutes, authRoutes])

app.listen(PORT, () => {
  consola.log(`Listening on port ${PORT}...`)
})
