import { test, expect } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'

test('GET /api/invalid', async () => {
  const response = await supertest(app)
    .get('/api/invalid')
  expect(response.status).toEqual(404)
  expect(response.text)
    .toEqual('{"message":"Could not find this route."}')
})
