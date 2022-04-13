import React, { useEffect, useState, useContext } from 'react'

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
  const [selectedList, setSelectedList] = useState(() =>
    props.items.length > 0 ? props.items[0].id : ''
  )

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)
  const showDeleteConfirmationHandler = () =>
    setShowDeleteConfirmationModal(true)
  const cancelDeleteConfirmationHandler = () =>
    setShowDeleteConfirmationModal(false)

  useEffect(() => {
    props.changeSelectedList(selectedList)
  }, [selectedList, props])

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
      <div className="task-list-select">
        <label htmlFor="list-select">
          <h3>Select workspace</h3>
        </label>
        <select
          id="list-select"
          onChange={(e) => setSelectedList(e.target.value)}
        >
          {props.items.map((tasklist) => {
            return (
              <option value={tasklist.id} key={tasklist.id}>
                {tasklist.name}
              </option>
            )
          })}
        </select>
        <Modal
          show={showDeleteConfirmationModal}
          header="Are you sure?"
          footerClass="task-card__modal-actions"
          footer={
            <React.Fragment>
              <Button inverse onClick={cancelDeleteConfirmationHandler}>
                Cancel
              </Button>
              <Button
                delete
                danger
                onClick={() => removeTaskListHandler(selectedList)}
              >
                Delete
              </Button>
            </React.Fragment>
          }
        >
          <p>You will lose all tasks inside the workspace as well.</p>
        </Modal>
        <Button delete danger onClick={showDeleteConfirmationHandler}>
          <i className="fa fa-trash"></i>
        </Button>
      </div>
    </React.Fragment>
  )
}

export default TaskLists
