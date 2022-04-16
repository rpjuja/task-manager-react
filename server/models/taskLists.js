import pool from '../database/db.js'

const getAllTaskListsForUser = async (uid) => {
  const taskLists = await pool.query(
    'SELECT * FROM taskLists WHERE creator=$1',
    [uid]
  )
  return taskLists.rows
}

const getTaskListById = async (lid) => {
  const taskList = await pool.query('SELECT * FROM taskLists WHERE id=$1', [
    lid
  ])
  return taskList.rows[0]
}

const getAllTasksFromTaskList = async (lid) => {
  const tasks = await pool.query(
    `
  SELECT T.*
  FROM tasks T
  JOIN taskLists TL
  ON T.list_id=TL.id
  WHERE TL.id=$1
  ORDER BY deadline
  `,
    [lid]
  )
  return tasks.rows
}

const addTaskList = async (task) => {
  const result = await pool.query(
    'INSERT INTO taskLists (id, name, creator) VALUES ($1, $2, $3)',
    [task.id, task.name, task.creator]
  )
  return result.rows
}

const deleteTaskListById = async (lid) => {
  const result = await pool.query(
    `
  DELETE FROM taskLists
  WHERE id=$1`,
    [lid]
  )
  return result.rowCount !== 0
}

export {
  getAllTaskListsForUser,
  getTaskListById,
  getAllTasksFromTaskList,
  addTaskList,
  deleteTaskListById
}
