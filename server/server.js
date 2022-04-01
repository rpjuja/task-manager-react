import express from 'express'
import bodyParser from 'body-parser'

import usersRouter from './routes/users.js'
import tasksRouter from './routes/tasks.js'
import HttpError from './models/http-error.js'

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/users', usersRouter)
app.use('/api/tasks', tasksRouter)

app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res.status(error.code || 500)
  res.json({ message: error.message || 'Unknown error occured' })
})

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`API is running on port ${port}`)
})

export default app