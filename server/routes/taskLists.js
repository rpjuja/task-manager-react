import { Router } from 'express'
import { check } from 'express-validator'

import {
  getUsersTaskLists,
  getTaskList,
  getTasksFromTaskList,
  createTaskList,
  deleteTaskList
} from '../controllers/taskLists.js'

import checkToken from '../middleware/verifyToken.js'

const taskListsRouter = Router()

taskListsRouter.get('/:uid', getUsersTaskLists)

taskListsRouter.get('/tasklist/:lid', getTaskList)

taskListsRouter.get('/:lid/tasks', getTasksFromTaskList)

taskListsRouter.use(checkToken)

taskListsRouter.post(
  '/',
  [check('name').isLength({ min: 5, max: 50 }), check('creator').notEmpty()],
  createTaskList
)

taskListsRouter.delete('/:lid', deleteTaskList)

export default taskListsRouter
