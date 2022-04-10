import React, { useContext, useState, createRef, useEffect } from 'react'

import Button from '../button/Button'
import Modal from '../modal/Modal'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { AuthContext } from '../../context/Auth-context'
import { useHttpClient } from '../../hooks/http-hook'

import TaskEditModal from './TaskEditModal'
import './TaskCard.css'

const TaskCard = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  // State and ref for opening and closing dropdown menu correctly
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdown = createRef()

  const showConfirmationHandler = () => setShowConfirmationModal(true)
  const cancelConfirmationHandler = () => setShowConfirmationModal(false)
  const showEditModal = () => setEditModal(true)
  const hideEditModal = () => setEditModal(false)

  useEffect(() => {
    // Close dropdown menu if user clicks outside the menu
    const handleClickOutside = (event) => {
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
  }, [dropdown, dropdownOpen])

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
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showConfirmationModal}
        header="Are you sure?"
        footerClass="task-card__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelConfirmationHandler}>
              Cancel
            </Button>
            <Button delete danger onClick={deleteConfirmedHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>There's no going back.</p>
      </Modal>
      <li className="task-card">
        <div class="dropdown" ref={dropdown}>
          <button
            className="dropbtn"
            onClick={() => {
              setDropdownOpen(!dropdownOpen)
            }}
          >
            ☰
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              <button onClick={() => {}}>Swith Status</button>
              <div>
                <TaskEditModal
                  id={props.id}
                  title={props.title}
                  description={props.description}
                  deadline={props.deadline}
                  show={editModal}
                  handleClose={hideEditModal}
                  update={props.update}
                />
              </div>
              <button onClick={showEditModal}>Edit</button>
              <button onClick={showConfirmationHandler}>
                Delete
              </button>
            </div>
          )}
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
