import express from 'express'
import bodyParser from 'body-parser'

import usersRouter from './routes/users.js'
import tasksRouter from './routes/tasks.js'
import taskListsRouter from './routes/taskLists.js'
import HttpError from './models/http-error.js'

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  const corsWhitelist = ['http://localhost:3000', 'http://172.16.5.50']
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  }
  next()
})

app.use('/api/users', usersRouter)
app.use('/api/tasklists', taskListsRouter)
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

const port = process.env.API_PORT || 5000
// Avoid port collision while running tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API is running on port ${port}`)
  })
}
export default app
