import jwt from 'jsonwebtoken'
import HttpError from '../models/http-error.js'
import 'dotenv/config'

const verifyToken = (req, res, next) => {
  // Default behavior is that an OPTIONS request is sent before all but GET
  if (req.method === 'OPTIONS') {
    return next()
  }
  // we will use the headers for our token
  try {
    const token = req.headers.authorization.split(' ')[1] // Convention is 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed')
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY || 'this_is_my_supersecret_key')
    req.userData = { userId: decodedToken.userId }
    next()
  } catch (err) {
    return next(new HttpError('Authentication failed.', 401))
  }
}

export default verifyToken
