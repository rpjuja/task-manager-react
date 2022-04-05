import React, { useState, useEffect, useContext } from 'react'

import TaskList from '../components/tasks/TaskList'
import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from '../context/Auth-context'

const Tasks = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [taskData, setTaskData] = useState()
  // State used to update the list if a task is deleted or edited
  const [toggle, setToggle] = useState(false)
  const userId = auth.userId

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const tasks = await sendRequest(
          `http://localhost:5000/api/tasks/${userId}`
        )
        setTaskData(tasks)
      } catch (err) {}
    }
    fetchUsers()
  }, [userId, sendRequest, toggle]) //We can add sendRequest as dependency because useCallback will prevent a loop

  // Fetch tasks again and update list by setting state that's in useEffect dependencies
  const updateList = () => {
    setToggle((prevState) => !prevState)
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && taskData && (
        <TaskList items={taskData.tasks} update={updateList}></TaskList>
      )}
    </React.Fragment>
  )
}

export default Tasks
