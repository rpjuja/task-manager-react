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

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['john@reese.com'])

  const userData = {
    name: 'John Reese',
    email: 'john@reese.com',
    password: 'password123'
  }

  const signupRes = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  loggedInUser.email = signupRes.body.email
  loggedInUser.userId = signupRes.body.userId
  loggedInUser.token = signupRes.body.token
})

test('POST /api/tasklists creates a task list', async () => {
  const newTaskList = {
    name: 'Project work',
    creator: loggedInUser.userId
  }
  const response = await supertest(app)
    .post('/api/tasklists')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
    .send(newTaskList)
  expect(response.status).toBe(201)
  expect(response.body.taskList.id).toBeTruthy()
  expect(response.body.taskList.name).toBe('Project work')
  expect(response.body.taskList.creator).toBe(loggedInUser.userId)

  createdTaskListId = response.body.taskList.id
})

test('GET /api/tasklists/userId returns task lists from user', async () => {
  const response = await supertest(app)
    .get('/api/tasklists/' + loggedInUser.userId)
    .set('Accept', 'application/json')
  expect(response.status).toBe(200)
  expect(Array.isArray(response.body.taskLists)).toBeTruthy()
})

test('DELETE /api/tasklists/taskListId deletes a task list', async () => {
  const response = await supertest(app)
    .delete('/api/tasklists/' + createdTaskListId)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + loggedInUser.token)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Task list deleted')
})
