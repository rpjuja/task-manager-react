/* eslint-disable camelcase */
import { validationResult } from 'express-validator'
import { v4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import HttpError from '../models/http-error.js'

import {
  addUser,
  editExistingUser,
  deleteUserWithId,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserArrayById,
  getUserRowCountByEmail
} from '../models/users.js'

const getUser = async (req, res, next) => {
  const id = req.params.uid
  const user = await getUserArrayById(id)
  res.json({ users: user })
}

const getUsers = async (req, res, next) => {
  const users = await getAllUsers()
  res.json({ users: users })
}

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const { name, email, password, isAdmin } = req.body

  const exist = await getUserRowCountByEmail(email)
  if (exist) {
    return next(new HttpError('Could not create user, user exist', 422))
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }

  const newUser = {
    id: v4(),
    name,
    email,
    password: hashedPassword,
    isAdmin: isAdmin || false
  }

  const result = await addUser(newUser)
  if (!result) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email
      },
      process.env.JWT_KEY || 'this_is_my_supersecret_key',
      {
        expiresIn: '1h'
      }
    )
  } catch (err) {
    return next(new HttpError('Signup process failed, try again', 500))
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token: token,
    isAdmin: newUser.isAdmin
  })
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  const identifiedUser = await getUserByEmail(email)

  if (!identifiedUser) {
    return next(
      new HttpError('Could not identify user, credentials might be wrong', 401)
    )
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    return next(new HttpError('Something went wrong when logging in', 500))
  }

  if (!isValidPassword) {
    return next(
      new HttpError('Could not identify user, credentials might be wrong', 401)
    )
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: identifiedUser.id,
        email: identifiedUser.email
      },
      process.env.JWT_KEY || 'this_is_my_supersecret_key',
      {
        expiresIn: '1h'
      }
    )
  } catch (err) {
    return next(new HttpError('Login process failed, try again', 500))
  }

  res.status(201).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
    isAdmin: identifiedUser.isadmin
  })
}

const changePassword = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const id = req.params.uid
  const { currentPassword, newPassword } = req.body

  const identifiedUser = await getUserById(id)
  if (!identifiedUser) {
    return next(new HttpError('Could not find a user for the provided id', 404))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(
      currentPassword,
      identifiedUser.password
    )
  } catch (err) {
    return next(
      new HttpError('Something went wrong when changing the password', 500)
    )
  }

  if (!isValidPassword) {
    return next(
      new HttpError('Could not identify user, credentials might be wrong', 401)
    )
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12)
  } catch (err) {
    return next(
      new HttpError('Something went wrong when changing the password', 500)
    )
  }

  const loggedInUser = await getUserById(req.userData.userId)

  if (identifiedUser.id !== loggedInUser.id) {
    return next(new HttpError('Not authorized to update the user', 401))
  }

  const result = await editExistingUser(hashedPassword, id)
  if (!result) {
    return next(new HttpError('Something went wrong editing the user', 500))
  }

  res.status(200).json({ message: 'Password updated' })
}

const deleteUser = async (req, res, next) => {
  const id = req.params.uid

  const userToDelete = await getUserById(id)
  if (!userToDelete) {
    return next(new HttpError('Could not find a user for the provided id', 404))
  }

  const loggedInUser = await getUserById(req.userData.userId)

  if (userToDelete.id !== loggedInUser.id && !loggedInUser.isadmin) {
    return next(new HttpError('Not authorized to delete the user', 401))
  }

  const result = await deleteUserWithId(id)

  if (!result) {
    return next(
      new HttpError('Could not delete the user for the provided id', 404)
    )
  }
  res.status(200).json({ message: 'Deleted the user' })
}

export { getUser, getUsers, changePassword, deleteUser, signUpUser, loginUser }
