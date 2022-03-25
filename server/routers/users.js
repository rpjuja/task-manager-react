import { Router } from 'express'
import { check } from 'express-validator'

import {
  getUser,
  getUsers,
  editUser,
  deleteUser,
  signUpUser,
  loginUser
} from '../controllers/users.js'

const usersRouter = Router()

usersRouter.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signUpUser
)

usersRouter.post('/login', loginUser)

usersRouter.get('/users', getUsers)

usersRouter.get('/users/:uid', getUser)

usersRouter.patch(
  '/users/:uid',
  [check('name').notEmpty(), check('password').isLength({ min: 6 })],
  editUser
)

usersRouter.delete('/users/:uid', deleteUser)

export default usersRouter
