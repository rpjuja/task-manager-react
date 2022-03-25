import { Router } from 'express'
import { check } from 'express-validator'

import {
  getUsersTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasks.js'

const tasksRouter = Router()

tasksRouter.get('/:uid', getUsersTasks)

tasksRouter.get('/task/:tid', getTask)

tasksRouter.post(
  '/',
  [
    check('title').notEmpty(),
    check('description').notEmpty(),
    check('deadline').notEmpty()
  ],
  createTask
)

tasksRouter.patch(
  '/:tid',
  [
    check('title').notEmpty(),
    check('description').notEmpty(),
    check('deadline').notEmpty()
  ],
  updateTask
)

tasksRouter.delete('/:tid', deleteTask)

export default tasksRouter
