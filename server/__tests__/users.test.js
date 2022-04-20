import { test, expect } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'
import pool from '../database/db.js'

const userData = {
  name: 'John Wayne',
  email: 'john@wayne.com',
  password: 'password'
}

let createdUserId

test('POST /api/users/signup', async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['john@wayne.com'])

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(201)
  expect(response.body.email).toBe('john@wayne.com')
  expect(response.body.token).toBeTruthy()
  expect(response.body.userId).toBeTruthy()
  expect(response.body.isAdmin).toBeFalsy()

  createdUserId = response.body.userId
})

test('GET /api/users returns list of users', async () => {
  await supertest(app)
    .get('/api/users/')
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.users)).toBeTruthy()
      expect(response.body.users[0].password).toBeFalsy()
    })
})

test('GET /api/users/userId returns a user in an array', async () => {
  await supertest(app)
    .get(`/api/users/${createdUserId}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.users)).toBeTruthy()
      expect(response.body.users[0].password).toBeFalsy()
    })
})

test('POST /api/users/signup when user exists', async () => {
  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(422)
  expect(response.body.message).toEqual('Could not create user, user exist')
})

test('POST /api/users/login', async () => {
  delete userData.name
  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(201)
  expect(response.body.email).toBe('john@wayne.com')
  expect(response.body.token).toBeTruthy()
  expect(response.body.userId).toBe(createdUserId)
  expect(response.body.isAdmin).toBeFalsy()
  expect(response.body.password).toBeFalsy()
})

test('POST /api/users/login with wrong email', async () => {
  userData.email = 'j@w.com'

  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(401)
  expect(response.text).toBe(
    '{"message":"Could not identify user, credentials might be wrong"}'
  )
})

test('POST /api/users/login with wrong password', async () => {
  userData.email = 'john@wayne.com'
  userData.password = 'wrongpassword'

  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(401)
  expect(response.text).toBe(
    '{"message":"Could not identify user, credentials might be wrong"}'
  )
})

test('PATCH /api/users/userId modifies users name and password', async () => {
  const modifiedUser = {
    name: 'Jack Wayne',
    password: 'password123'
  }

  const response = await supertest(app)
    .patch(`/api/users/${createdUserId}`)
    .set('Accept', 'application/json')
    .send(modifiedUser)
  expect(response.status).toBe(200)
  expect(response.body.name).toBe('Jack Wayne')
  expect(response.body.password).toBeFalsy()
})

test('DELETE /api/users/userId deletes the user', async () => {
  const response = await supertest(app).delete(`/api/users/${createdUserId}`)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Deleted the user')
})

test('POST /api/users/signup with invalid name length', async () => {
  await pool.query('DELETE FROM users WHERE email=$1', ['john@wayne.com'])

  userData.password = 'password'
  userData.name = ''

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(422)
  expect(response.text).toBe(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('POST /api/users/signup with invalid email', async () => {
  userData.name = 'John Wayne'
  userData.email = 'john@wayne'

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(422)
  expect(response.text).toBe(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('POST /api/users/signup with invalid password', async () => {
  userData.email = 'john@wayne.com'
  userData.password = 'pass'

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(userData)
  expect(response.status).toBe(422)
  expect(response.text).toBe(
    '{"message":"Invalid values given, please check the data"}'
  )
})
