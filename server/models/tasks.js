import pool from "../database/db.js";

const getAllTasksForUser = async (uid) => {
  const tasks = await pool.query(
    "SELECT * FROM tasks WHERE creator=$1 ORDER BY deadline ASC",
    [uid]
  );
  console.log(tasks);
  return tasks.rows;
};

const getTaskById = async (tid) => {
  const task = await pool.query("SELECT * FROM tasks WHERE id=$1", [tid]);
  console.log(task);
  return task.rows;
};

const addTask = async (task) => {
  const result = await pool.query(
    "INSERT INTO tasks (id, title, description, deadline, status, creator) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      task.id,
      task.title,
      task.description,
      task.deadline,
      task.status,
      task.creator,
    ]
  );
  return result.rows;
};

const updateTaskById = async (tid, title, description, deadline) => {
  const result = await pool.query(
    "UPDATE tasks SET title=$1, description=$2, deadline=$3 WHERE id=$4",
    [title, description, deadline, tid]
  );
  return result.rowCount !== 0;
};

const deleteTaskById = async (tid) => {
  const result = await pool.query("DELETE FROM tasks WHERE id=$1", [tid]);
  return result.rowCount !== 0;
};

export {
  getAllTasksForUser,
  getTaskById,
  addTask,
  updateTaskById,
  deleteTaskById,
};
