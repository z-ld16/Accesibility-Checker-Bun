import express from 'express'
import consola from 'consola'

import { loadEnv } from './src/config/environment-variables.ts'
import usersRoutes from './src/routes/users.routes.ts'
import scanRoutes from './src/routes/scan.routes.ts'
import authRoutes from './src/routes/auth.routes.ts'

const { PORT } = loadEnv()
const app = express()
app.use(express.json())
app.use('/api', [usersRoutes, scanRoutes, authRoutes])

app.listen(PORT, () => {
  consola.log(`Listening on port ${PORT}...`)
})
