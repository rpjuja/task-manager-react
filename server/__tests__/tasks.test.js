import { test, expect, beforeAll } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'
import pool from '../database/db.js'

const loggedInUser = {
  userId: '',
  email: '',
  token: ''
}

let createdTaskListId
let createdTaskId

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['shawn@carter.com'])

  const userData = {
    name: 'Shawn Carter',
    email: 'shawn@carter.com',
    password: 'password'
  }

  const signupRes = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  loggedInUser.email = signupRes.body.email
  loggedInUser.userId = signupRes.body.userId
  loggedInUser.token = signupRes.body.token

  const newTaskList = {
    name: 'Project work',
    creator: loggedInUser.userId
  }

  const taskListRes = await supertest(app)
    .post('/api/tasklists')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send(newTaskList)
  createdTaskListId = taskListRes.body.taskList.id
})

test('POST /api/tasks creates a task ', async () => {
  const newTask = {
    title: 'Finish backend',
    description:
      'Finish building the backend for web development course project',
    // Whitout .000Z timestamp will create a datetime that's 3 hours behind
    deadline: '2022-04-01T18:00:00.000Z',
    status: 0,
    list_id: createdTaskListId
  }

  const response = await supertest(app)
    .post('/api/tasks')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send(newTask)
  expect(response.status).toBe(201)
  expect(response.body.task.id).toBeTruthy()
  expect(response.body.task.title).toBe('Finish backend')
  expect(response.body.task.description).toBe(
    'Finish building the backend for web development course project'
  )
  expect(response.body.task.deadline).toBe('2022-04-01T18:00:00.000Z')
  expect(response.body.task.status).toBe(0)
  expect(response.body.task.list_id).toBe(createdTaskListId)

  createdTaskId = response.body.task.id
})

// Testing taskLists route here because this is testing the tasks inside and not the task list
test('GET /api/tasklists/taskListId/tasks returns tasks from a task list', async () => {
  const response = await supertest(app)
    .get('/api/tasklists/' + createdTaskListId + '/tasks')
    .set('Accept', 'application/json')
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body.tasks)).toBeTruthy()
})

test('GET /api/tasks/task/taskId returns a task', async () => {
  const response = await supertest(app)
    .get('/api/tasks/task/' + createdTaskId)
    .set('Accept', 'application/json')
  expect(response.status).toBe(200)
  expect(response.body.task.id).toBe(createdTaskId)
  expect(response.body.task.title).toBe('Finish backend')
  expect(response.body.task.description).toBe(
    'Finish building the backend for web development course project'
  )
  expect(response.body.task.deadline).toBe('2022-04-01T18:00:00.000Z')
})

test('PATCH /api/tasks/taskId updates the task', async () => {
  const updatedTask = {
    title: 'Finish frontend',
    description:
      'Finish building the frontend for web development course project',
    deadline: '2022-04-20T18:00:00.000Z'
  }

  const response = await supertest(app)
    .patch('/api/tasks/' + createdTaskId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send(updatedTask)
  expect(response.status).toBe(200)
  expect(response.body.task.id).toBe(createdTaskId)
  expect(response.body.task.title).toBe('Finish frontend')
  expect(response.body.task.description).toBe(
    'Finish building the frontend for web development course project'
  )
  expect(response.body.task.deadline).toBe('2022-04-20T18:00:00.000Z')
})

test('PATCH /api/tasks/status/taskId updates the status of a task', async () => {
  const response = await supertest(app)
    .patch('/api/tasks/status/' + createdTaskId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send({ status: 1 })
  expect(response.status).toBe(200)
  expect(response.body.task.id).toBe(createdTaskId)
  expect(response.body.task.title).toBe('Finish frontend')
  expect(response.body.task.description).toBe(
    'Finish building the frontend for web development course project'
  )
  expect(response.body.task.deadline).toBe('2022-04-20T18:00:00.000Z')
  expect(response.body.task.status).toBe(1)
})

test('DELETE /api/tasks/taskId deletes the task', async () => {
  const response = await supertest(app)
    .delete('/api/tasks/' + createdTaskId)
    .set('Authorization', 'Bearer ' + loggedInUser.token)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Task deleted')
})
