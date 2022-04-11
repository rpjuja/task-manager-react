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

taskListsRouter.post('/', [check('name').notEmpty()], createTaskList)

taskListsRouter.delete('/:lid', deleteTaskList)

export default taskListsRouter
