import express from 'express'
import consola from 'consola'

import routes from './routes/index.ts'

const app = express()
app.use(express.json())
const port = 3000

app.use('/api', routes)

app.listen(port, () => {
  consola.log(`Listening on port ${port}...`)
})
