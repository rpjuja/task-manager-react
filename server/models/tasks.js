import pool from '../database/db.js'

const getTaskById = async (tid) => {
  const task = await pool.query('SELECT * FROM tasks WHERE id=$1', [tid])
  return task.rows[0]
}

const addTask = async (task) => {
  const result = await pool.query(
    'INSERT INTO tasks (id, title, description, deadline, status, list_id) VALUES ($1, $2, $3, $4, $5, $6)',
    [
      task.id,
      task.title,
      task.description,
      task.deadline,
      task.status,
      task.list_id
    ]
  )
  return result.rows
}

const updateTaskById = async (tid, title, description, deadline) => {
  const result = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, deadline=$3 WHERE id=$4',
    [title, description, deadline, tid]
  )
  return result.rowCount !== 0
}

const deleteTaskById = async (tid) => {
  const result = await pool.query('DELETE FROM tasks WHERE id=$1', [tid])
  return result.rowCount !== 0
}

const getTaskListCreator = async (tid) => {
  const result = await pool.query(
    `
  SELECT TL.creator
  FROM taskLists TL
  INNER JOIN tasks T ON TL.id=T.list_id
  WHERE T.id=$1`,
    [tid]
  )
  return result.rows[0]
}

export {
  // getAllTasksForUser,
  getTaskById,
  addTask,
  updateTaskById,
  deleteTaskById,
  getTaskListCreator
}
