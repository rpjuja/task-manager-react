import { Router } from 'express'
import { check } from 'express-validator'

import {
  getUser,
  getUsers,
  changePassword,
  deleteUser,
  signUpUser,
  loginUser
} from '../controllers/users.js'

import checkToken from '../middleware/verifyToken.js'

const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:uid', getUser)

usersRouter.post(
  '/signup',
  [
    check('name').isLength({ min: 1, max: 100 }),
    check('email').normalizeEmail().isEmail().isLength({ max: 100 }),
    check('password').isLength({ min: 6 })
  ],
  signUpUser
)

usersRouter.post('/login', loginUser)

usersRouter.use(checkToken)

usersRouter.patch(
  '/:uid',
  [check('currentPassword').notEmpty(), check('newPassword').isLength({ min: 6 })],
  changePassword
)

usersRouter.delete('/:uid', deleteUser)

export default usersRouter
