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
  const [taskLists, setTaskLists] = useState([])
  const [selectedList, setSelectedList] = useState()
  const [newListName, setNewListName] = useState()
  // State used to update the task lists if a task list is added or deleted
  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/tasklists/${userId}`
        )
        setTaskLists(res.taskLists)
        setSelectedList(res.taskLists[0].id)
      } catch (err) {}
    }
    fetchTaskLists()
  }, [userId, toggle, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

  const addTaskListHandler = async (listName) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/tasklists`,
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

  if (!isLoading && !error && taskLists.length === 0) {
    return (
      <div className="no-workspace">
        <h2>Create your first workspace</h2>
        <div className="ws-input">
          <input
            id="ws-name-input"
            type="text"
            onChange={(e) => setNewListName(e.target.value)}
          />
        </div>
        <Button onClick={() => addTaskListHandler(newListName)}>Create</Button>
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
      {!isLoading && taskLists && (
        <div className="task-screen">
          <TaskListData selectedList={selectedList} update={updateTaskLists} />
          <TaskLists
            items={taskLists}
            selectedList={selectedList}
            changeSelectedList={setSelectedList}
            newTaskList={addTaskListHandler}
            update={updateTaskLists}
          />
        </div>
      )}
    </React.Fragment>
  )
}

export default Tasks
