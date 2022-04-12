import React, { useState, useEffect, useContext } from 'react'

import TaskList from '../components/tasks/TaskList'
import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from '../context/Auth-context'

import './Tasks.css'

const Tasks = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [taskListData, setTaskListData] = useState()
  const userId = auth.userId

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/tasklists/${userId}`
        )
        setTaskListData(res.taskLists)
      } catch (err) {}
    }
    fetchTaskLists()
  }, [userId, sendRequest]) //We can add sendRequest as dependency because useCallback will prevent a loop

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && taskListData && <TaskList items={taskListData}></TaskList>}
    </React.Fragment>
  )
}

export default Tasks
