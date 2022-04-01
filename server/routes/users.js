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

usersRouter.get('/', getUsers)

usersRouter.get('/:uid', getUser)

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

usersRouter.patch(
  '/:uid',
  [check('name').notEmpty(), check('password').isLength({ min: 6 })],
  editUser
)

usersRouter.delete('/:uid', deleteUser)

export default usersRouter
