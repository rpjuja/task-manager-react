import React, { useContext, useState } from 'react'

import Button from '../button/Button'
import Modal from '../modal/Modal'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { AuthContext } from '../../context/Auth-context'
import { useHttpClient } from '../../hooks/http-hook'

import './TaskCard.css'

const TaskCard = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const showConfirmationHandler = () => setShowConfirmationModal(true)
  const cancelConfirmationHandler = () => setShowConfirmationModal(false)

  const deleteConfirmedHandler = async () => {
    setShowConfirmationModal(false)
    try {
      await sendRequest(
        `http://localhost:5000/api/tasks/${props.id}`,
        'DELETE',
        null, // No body
        { Authorization: 'Bearer ' + auth.token }
      )
      props.update()
    } catch (err) {}
  }

  const printTimestamp = (timestamp) => {
    const temp = timestamp.split('T')[0]
    const date =
      temp.substring(8, 10) +
      '-' +
      temp.substring(5, 7) +
      '-' +
      temp.substring(0, 4)
    const time = timestamp.split('T')[1].substring(0,5)
    return (
      <p>
        {date} {time}
      </p>
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmationModal}
        header="Are you sure?"
        footerClass="task-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelConfirmationHandler}>
              Cancel
            </Button>
            <Button delete onClick={deleteConfirmedHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Are you sure? Once it's gone, it's gone!</p>
      </Modal>
      <li className="task-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="task-card">
          <div className="task-item__info">
            <h3>{props.title}</h3>
            {printTimestamp(props.deadline)}
          </div>
          <div className="task-item__buttons">
            {auth.isLoggedIn && (
              <div>
                <Button to={`/tasks/${props.id}`}>Edit</Button>
                <Button danger onClick={showConfirmationHandler}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </li>
    </React.Fragment>
  )
}

export default TaskCard
