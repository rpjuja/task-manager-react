import { v4 } from 'uuid'
import { validationResult } from 'express-validator'

import HttpError from '../models/http-error.js'
import {
  getAllTaskListsForUser,
  getTaskListById,
  getAllTasksFromTaskList,
  addTaskList,
  deleteTaskListById
} from '../models/taskLists.js'

const getUsersTaskLists = async (req, res, next) => {
  const uid = req.params.uid
  const taskLists = await getAllTaskListsForUser(uid)
  res.json({ taskLists: taskLists })
}

const getTasksFromTaskList = async (req, res, next) => {
  const lid = req.params.lid
  const tasks = await getAllTasksFromTaskList(lid)
  res.json({ tasks: tasks })
}

const createTaskList = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const newTaskList = {
    id: v4(),
    name: req.body.name,
    creator: req.body.creator
  }
  const result = await addTaskList(newTaskList)
  if (!result) {
    return next(
      new HttpError('Something went wrong creating the taskTasklistlist', 500)
    )
  }
  res.status(201).json({ taskList: newTaskList })
}

const deleteTaskList = async (req, res, next) => {
  const lid = req.params.lid

  const taskList = await getTaskListById(lid)
  if (!taskList) {
    return next(
      new HttpError('Could not find a tasklist for the provided id', 404)
    )
  }

  if (taskList.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to delete the tasklist', 401))
  }

  const result = await deleteTaskListById(lid)
  if (!result) {
    return next(
      new HttpError('Could not delete the tasklist with the provided id', 404)
    )
  }
  res.status(200).json({ message: 'Tasklist deleted' })
}

export {
  getUsersTaskLists,
  getTasksFromTaskList,
  createTaskList,
  deleteTaskList
}
