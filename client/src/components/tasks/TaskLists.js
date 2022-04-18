import React, { useState, useContext } from 'react'

import Modal from '../modal/Modal'
import Button from '../button/Button'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { useHttpClient } from '../../hooks/http-hook'
import { AuthContext } from '../../context/Auth-context'

import './TaskLists.css'

const TaskLists = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showInput, setShowInput] = useState(false)
  const [newListName, setNewListName] = useState()
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const removeTaskListHandler = async (taskListId) => {
    setShowDeleteConfirmationModal(false)
    try {
      await sendRequest(
        `http://localhost:5000/api/tasklists/${taskListId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.update()
    } catch (e) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <Modal
        show={showDeleteConfirmationModal}
        header="Are you sure?"
        footerClass="task-card__modal-actions"
        footer={
          <React.Fragment>
            <Button
              inverse
              onClick={() => setShowDeleteConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button
              delete
              danger
              onClick={() => removeTaskListHandler(props.selectedList)}
            >
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>You will lose all tasks inside the workspace as well.</p>
      </Modal>
      <div className="task-list-select">
        <label htmlFor="list-select">
          <h3>Select workspace</h3>
        </label>
        <div className="select-and-buttons">
          <select
            id="list-select"
            onChange={(e) => {
              props.changeSelectedList(e.target.value)
            }}
          >
            {props.items.map((tasklist) => {
              return (
                <option value={tasklist.id} key={tasklist.id}>
                  {tasklist.name}
                </option>
              )
            })}
          </select>
          <div>
            <Button
              delete
              danger
              onClick={() => setShowDeleteConfirmationModal(true)}
            >
              <i className="fa fa-trash"></i>
            </Button>
            <Button
              onClick={() => {
                setShowInput(!showInput)
              }}
            >
              <i className="fa fa-plus"></i>
            </Button>
          </div>
        </div>
        {showInput && (
          <div className="new-ws-input">
            <div className="arrow-up"></div>
            <input
              type="text"
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button onClick={() => props.newTaskList(newListName)}>
              + Add Task List
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default TaskLists
