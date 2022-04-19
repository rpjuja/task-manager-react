import { v4 } from 'uuid'
import { validationResult } from 'express-validator'

import HttpError from '../models/http-error.js'
import {
  getTaskById,
  getTaskListCreator,
  addTask,
  updateTaskById,
  updateTaskStatusById,
  deleteTaskById
} from '../models/tasks.js'

const getTask = async (req, res, next) => {
  const tid = req.params.tid
  const task = await getTaskById(tid)
  res.json({ task: task })
}

const createTask = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  // eslint-disable-next-line camelcase
  const { title, description, deadline, status, list_id } = req.body
  const newTask = {
    id: v4(),
    title,
    description,
    deadline: deadline,
    status: status,
    list_id
  }

  const result = await addTask(newTask)
  if (!result) {
    return next(new HttpError('Something went wrong creating the task', 500))
  }
  res.status(201).json({ task: newTask })
}

const updateTask = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const { title, description, deadline } = req.body
  const tid = req.params.tid

  const task = await getTaskById(tid)

  if (!task) {
    return next(new HttpError('Could not find a task for the provided id', 404))
  }

  const creator = await getTaskListCreator(tid)
  if (creator.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to update the task', 401))
  }

  const result = await updateTaskById(tid, title, description, deadline)

  if (!result) {
    return next(
      new HttpError('Could not update the task with the provided id', 404)
    )
  }
  task.title = title
  task.description = description
  task.deadline = deadline

  res.status(200).json({ task: task })
}

const updateTaskStatus = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const { status } = req.body
  const tid = req.params.tid

  const task = await getTaskById(tid)

  if (!task) {
    return next(new HttpError('Could not find a task for the provided id', 404))
  }

  const creator = await getTaskListCreator(tid)
  if (creator.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to update the task', 401))
  }

  const result = await updateTaskStatusById(tid, status)

  if (!result) {
    return next(
      new HttpError('Could not update the task with the provided id', 404)
    )
  }
  task.status = status

  res.status(200).json({ task: task })
}

const deleteTask = async (req, res, next) => {
  const tid = req.params.tid

  const task = await getTaskById(tid)
  if (!task) {
    return next(new HttpError('Could not find a task for the provided id', 404))
  }

  const creator = await getTaskListCreator(tid)
  if (creator.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to delete the task', 401))
  }

  const result = await deleteTaskById(tid)
  if (!result) {
    return next(
      new HttpError('Could not delete the task with the provided id', 404)
    )
  }
  res.status(200).json({ message: 'Task deleted' })
}

export { getTask, createTask, updateTask, updateTaskStatus, deleteTask }
