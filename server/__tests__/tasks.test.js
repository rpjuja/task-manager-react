import { test, expect, beforeAll } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'
import pool from '../database/db.js'

const loggedInUser = {
  userId: '',
  email: '',
  token: ''
}

let createdTaskId

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['shawn@carter.com'])

  const userData = {
    name: 'Shawn Carter',
    email: 'shawn@carter.com',
    password: 'password'
  }

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)

  loggedInUser.email = response.body.email
  loggedInUser.userId = response.body.userId
  loggedInUser.token = response.body.token
})

test('POST /api/tasks creates a task ', async () => {
  const newTask = {
    title: 'Finish backend',
    description:
      'Finish building the backend for web development course project',
    deadline: '2022-04-01T18:00:00',
    creator: loggedInUser.userId
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
  expect(response.body.task.deadline).toBe('2022-04-01T18:00:00')
  expect(response.body.task.creator).toBe(loggedInUser.userId)

  createdTaskId = response.body.task.id
})

test('GET /api/tasks/userId returns tasks for a user', async () => {
  const response = await supertest(app)
    .get('/api/tasks/' + loggedInUser.userId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body.tasks)).toBeTruthy()
})

test('GET /api/tasks/task/taskId returns a task', async () => {
  const response = await supertest(app)
    .get('/api/tasks/task/' + createdTaskId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
  expect(response.status).toBe(200)
  expect(response.body.task.id).toBe(createdTaskId)
  expect(response.body.task.title).toBeTruthy()
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
    deadline: '2022-04-20T18:00:00'
  }

  const response = await supertest(app)
    .patch('/api/tasks/' + createdTaskId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send(updatedTask)
  expect(response.status).toBe(200)
  expect(response.body.task.id).toBe(createdTaskId)
  expect(response.body.task.title).toBeTruthy()
  expect(response.body.task.title).toBe('Finish frontend')
  expect(response.body.task.description).toBe(
    'Finish building the frontend for web development course project'
  )
  expect(response.body.task.deadline).toBe('2022-04-20T18:00:00')
})

test('DELETE /api/tasks/taskId deletes the task', async () => {
  const response = await supertest(app)
    .delete('/api/tasks/' + createdTaskId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
  console.log(response)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Task deleted')
})
