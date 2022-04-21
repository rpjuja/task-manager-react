import React, { useState, useEffect, useContext } from 'react'

import TaskListData from '../components/tasks/TaskListData'
import TaskLists from '../components/tasks/TaskLists'

import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from '../context/Auth-context'

import './Tasks.css'

const Tasks = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const userId = auth.userId
  const [taskLists, setTaskLists] = useState([])
  const [selectedList, setSelectedList] = useState(false)
  // State used to update the task lists if a task list is added or deleted
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND}/tasklists/${userId}`
        )
        setTaskLists(res.taskLists)
        // Keep selectedList as false if there is no taskLists
        // so that taskListData knows not to render anything
        if (res.taskLists.length > 0) {
          setSelectedList(res.taskLists[0].id)
        } else setSelectedList(false)
      } catch (err) {}
    }
    fetchTaskLists()
  }, [userId, toggle, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

  const addTaskListHandler = async (listName) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/tasklists`,
        'POST',
        JSON.stringify({
          name: listName,
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

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && taskLists && (
        <div className="task-screen">
          <TaskListData selectedList={selectedList} update={updateTaskLists} />
          <TaskLists
            lists={taskLists}
            selectedList={selectedList}
            changeSelectedList={setSelectedList}
            newTaskList={addTaskListHandler}
            update={updateTaskLists}
            listsLoading={isLoading}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Tasks
