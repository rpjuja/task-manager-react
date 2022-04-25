import { Router } from 'express'
import { check } from 'express-validator'

import {
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/tasks.js'

import checkToken from '../middleware/verifyToken.js'

const tasksRouter = Router()

tasksRouter.get('/task/:tid', getTask)

tasksRouter.use(checkToken)

tasksRouter.post(
  '/',
  [
    check('title').isLength({ min: 1, max: 50 }),
    check('description').isLength({ min: 1, max: 500 }),
    check('deadline').isISO8601().toDate(),
    check('status').notEmpty().isInt({ min: 0, max: 2 }),
    check('list_id').notEmpty()
  ],
  createTask
)

tasksRouter.patch(
  '/:tid',
  [
    check('title').isLength({ min: 1, max: 50 }),
    check('description').isLength({ min: 1, max: 500 }),
    check('deadline').isISO8601().toDate()
  ],
  updateTask
)

tasksRouter.patch(
  '/status/:tid',
  [check('status').notEmpty().isInt({ min: 0, max: 2 })],
  updateTaskStatus
)

tasksRouter.delete('/:tid', deleteTask)

export default tasksRouter
