import React, { useContext, useState, createRef, useEffect } from 'react'

import Button from '../button/Button'
import Modal from '../modal/Modal'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { AuthContext } from '../../context/Auth-context'
import { useHttpClient } from '../../hooks/http-hook'

import EditTaskModal from './EditTaskModal'
import './TaskCard.css'

const TaskCard = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  // States and refs for opening and closing dropdown menus correctly
  const [cardDropdownOpen, setCardDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const cardDropdownRef = createRef()
  const statusDropdownRef = createRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown menu(s) if user clicks outside the menu
      if (
        cardDropdownRef.current &&
        !cardDropdownRef.current.contains(event.target)
      ) {
        setCardDropdownOpen(false)
        setStatusDropdownOpen(false)
      }
      // Close status dropdown menu if user clicks something else on the card dropdown menu
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
  }, [cardDropdownRef, cardDropdownOpen, statusDropdownRef, statusDropdownOpen])

  const removeTaskHandler = async () => {
    setShowDeleteConfirmationModal(false)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/tasks/${props.id}`,
        'DELETE',
        null, // No body
        { Authorization: 'Bearer ' + auth.token }
      )
      props.update()
    } catch (err) {}
  }

  const updateTaskStatus = async (status) => {
    try {
      console.log(status)
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/tasks/status/${props.id}`,
        'PATCH',
        JSON.stringify({
          status: status
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.update()
    } catch (err) {}
  }

  // Print timestamp with dd/mm/yyyy hh:mm format
  const printTimestamp = (timestamp) => {
    const temp = timestamp.split('T')[0]
    const date =
      temp.substring(8, 10) +
      '-' +
      temp.substring(5, 7) +
      '-' +
      temp.substring(0, 4)
    const time = timestamp.split('T')[1].substring(0, 5)
    return (
      <p>
        {date} {time}
      </p>
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <EditTaskModal
        id={props.id}
        title={props.title}
        description={props.description}
        deadline={props.deadline}
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        update={props.update}
      />
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
            <Button delete danger onClick={removeTaskHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>There's no going back.</p>
      </Modal>
      <li className="task-card">
        <div className="dropdown" ref={cardDropdownRef}>
          <button
            className="dropbtn"
            onClick={() => {
              setCardDropdownOpen(!cardDropdownOpen)
            }}
          >
            ☰
          </button>
          {cardDropdownOpen && (
            <div className="dropdown-content">
              <button
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen)
                }}
              >
                Swith Status
              </button>
              <button onClick={() => setShowEditModal(true)}>Edit</button>
              <button onClick={() => setShowDeleteConfirmationModal(true)}>
                Delete
              </button>
            </div>
          )}
          <div ref={statusDropdownRef}>
            {statusDropdownOpen && (
              <div className="dropdown-content">
                <button
                  onClick={() => {
                    updateTaskStatus(0)
                  }}
                >
                  Backlog
                </button>
                <button
                  onClick={() => {
                    updateTaskStatus(1)
                  }}
                >
                  In Progress
                </button>
                <button
                  onClick={() => {
                    updateTaskStatus(2)
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="task-card__info">
          <h3>{props.title}</h3>
          {printTimestamp(props.deadline)}
          <a id={'show' + props.id} href={'#show' + props.id} className="show">
            More Details
          </a>
          <a id={'hide' + props.id} href="#/" className="hide">
            Less Details
          </a>
          <div className="details">
            <p>{props.description}</p>
          </div>
        </div>
      </li>
    </React.Fragment>
  )
}

export default TaskCard
