import pool from '../database/db.js'

const getAllUsers = async () => {
  const users = await pool.query('SELECT * FROM users ORDER BY id ASC')
  console.log(users)
  return users.rows
}

const getUserRowCountByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [
    email
  ])
  console.log(result)
  return result.rowCount !== 0
}

const getUserByEmail = async (email) => {
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  console.log(user)
  return user.rows[0]
}

const getUserById = async (id) => {
  const user = await pool.query('SELECT * FROM users WHERE id=$1', [id])
  console.log(user)
  return user.rows[0]
}

const getUserArrayById = async (id) => {
  const user = await pool.query('SELECT * FROM users WHERE id=$1', [id])
  console.log(user)
  return user.rows
}

const addUser = async (user) => {
  const result = await pool.query(
    'INSERT INTO users (id, name, email, password, isAdmin) VALUES ($1, $2, $3, $4, $5)',
    [user.id, user.name, user.email, user.password, user.isAdmin]
  )
  console.log(result)
  return result.rows
}

const editExistingUser = async (name, password, id) => {
  const result = await pool.query(
    'UPDATE users SET name=$1, password=$2 WHERE id=$3',
    [name, password, id]
  )
  console.log(result)
  return result.rows
}

const deleteUserWithId = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id=$1', [id])
  console.log(result)
  return result.rows
}

export {
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserArrayById,
  getUserRowCountByEmail,
  addUser,
  editExistingUser,
  deleteUserWithId
}
