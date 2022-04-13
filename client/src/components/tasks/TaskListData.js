import React, { useEffect, useState } from 'react'
import TaskCard from './TaskCard'

import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { useHttpClient } from '../../hooks/http-hook'

import './TaskListData.css'

const TaskListData = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [taskData, setTaskData] = useState([])
  // State used to update the list if a task is deleted or edited
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/tasklists/${props.list}/tasks`
        )
        setTaskData(res.tasks)
      } catch (err) {}
    }
    fetchTasks()
  }, [props.list, toggle, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

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
      {!isLoading && taskData && (
        <div className="tasks-grid">
          <div className="task-col-one">
            <h2>Backlog</h2>
            {}
            {taskData.map((task) => {
              return (
                task.status === 0 && (
                  <div className="card-padding" key={task.id}>
                    {insertTask(task)}
                  </div>
                )
              )
            })}
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
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default TaskListData
