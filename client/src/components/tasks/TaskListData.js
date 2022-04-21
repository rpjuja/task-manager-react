import React, { useEffect, useState } from 'react'

import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { useHttpClient } from '../../hooks/http-hook'

import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import './TaskListData.css'

const TaskListData = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [taskData, setTaskData] = useState([])
  const [newTaskStatus, setNewTaskStatus] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  // State used to update the list if a task is deleted or edited
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/tasklists/${props.selectedList}/tasks`
        )
        setTaskData(res.tasks)
      } catch (err) {}
    }
    fetchTasks()
  }, [props.selectedList, toggle, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

  console.log(props.selectedList)

  // Render nothing if there is no taskLists
  if (props.selectedList === false) {
    return <div></div>
  }

  // Fetch tasks again and update list by setting state that's in useEffect dependencies
  const updateList = () => {
    setToggle((prevState) => !prevState)
  }

  const insertTask = (task) => {
    return (
      <TaskCard
        id={task.id}
        title={task.title}
        description={task.description}
        deadline={task.deadline}
        status={task.status}
        update={updateList}
      />
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <AddTaskModal
        status={newTaskStatus}
        selectedList={props.selectedList}
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        update={updateList}
      />
      <div className="tasks-grid">
        <div className="task-col-one">
          <h2>Backlog</h2>
          {taskData.map((task) => {
            return (
              task.status === 0 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
          <div className="add-button">
            <button
              onClick={() => {
                setNewTaskStatus(0)
                setShowAddModal(true)
              }}
            >
              + Add Task
            </button>
          </div>
        </div>
        <div className="task-col-two">
          <h2>In Progress</h2>
          {taskData.map((task) => {
            return (
              task.status === 1 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
          <div className="add-button">
            <button
              onClick={() => {
                setNewTaskStatus(1)
                setShowAddModal(true)
              }}
            >
              + Add Task
            </button>
          </div>
        </div>
        <div className="task-col-three">
          <h2>Done</h2>
          {taskData.map((task) => {
            return (
              task.status === 2 && (
                <div className="card-padding" key={task.id}>
                  {insertTask(task)}
                </div>
              )
            )
          })}
          <div className="add-button">
            <button
              onClick={() => {
                setNewTaskStatus(2)
                setShowAddModal(true)
              }}
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default TaskListData
