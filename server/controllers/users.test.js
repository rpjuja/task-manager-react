import { jest, describe, it, expect } from '@jest/globals'

import { signUpUser } from './users'
import { getUserByEmail } from '../models/users'

const mockRequest = (body) => ({
  body,
})

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('The users controller', () => {
  it('should not write plain text password to the database', async () => {
    const req = mockRequest({
      name: 'John Doe',
      email: 'john.doe@domain.com',
      password: 'password',
    })
    const res = mockResponse()
    const mockedNext = jest.fn()

    await signUpUser(req, res, mockedNext)
    const dbEntry = await getUserByEmail('john.doe@domain.com')

    expect(req.body.password).not.toBe(dbEntry.password)
    expect(dbEntry.password.length).toBe(60)
  })
})
