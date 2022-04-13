import React, { useState, useEffect, useContext } from 'react'

import TaskListData from '../components/tasks/TaskListData'
import TaskLists from '../components/tasks/TaskLists'

import Button from '../components/button/Button'
import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from '../context/Auth-context'

import './Tasks.css'

const Tasks = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const userId = auth.userId
  const [taskListData, setTaskListData] = useState([])
  const [selectedList, setSelectedList] = useState()
  // State used to update the task lists if a task list is added or deleted
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/tasklists/${userId}`
        )
        // Update taskListData only if response array has something, otherwise keep state as undefined
        setTaskListData(res.taskLists)
      } catch (err) {}
    }
    fetchTaskLists()
  }, [userId, toggle, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

  const addTaskListHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/tasklists`,
        'POST',
        JSON.stringify({
          // TODO: Get name from user
          name: 'Project',
          creator: auth.userId
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      setToggle((prevState) => !prevState)
    } catch (e) {}
  }

  const updateTaskLists = () => {
    setToggle((prevState) => !prevState)
  }

  if (!isLoading && !error && taskListData.length === 0) {
    return (
      <div className="center">
        <h3>No workspace available</h3>
        <Button onClick={addTaskListHandler}>
          Create your first workspace
        </Button>
      </div>
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
      {!isLoading && taskListData && (
        <div className="task-screen">
          <TaskListData
            list={selectedList}
            newTaskList={addTaskListHandler}
            update={updateTaskLists}
          />
          <TaskLists
            items={taskListData}
            changeSelectedList={setSelectedList}
            update={updateTaskLists}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Tasks
