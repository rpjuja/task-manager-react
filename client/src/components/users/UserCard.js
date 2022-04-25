import React, { useState } from 'react'

import Button from '../button/Button'
import Modal from '../modal/Modal'

import UserEditModal from './UserEditModal'
import './UserCard.css'

const UserCard = (props) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  return (
    <React.Fragment>
      <UserEditModal
        id={props.user.id}
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
            <Button danger onClick={() => props.removeUser(props.user.id)}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>You will lose all your tasks and workspaces as well.</p>
      </Modal>
      {props.user && (
        <div className="card">
          <img
            src="https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
            alt=""
            className="profile-picture"
          />
          <h1>{props.user.name}</h1>
          <p className="email">{props.user.email}</p>
          <p>{props.user.isAdmin}</p>
          <div>
            <button
              className="user-card-buttons change-password"
              onClick={() => {
                setShowEditModal(true)
              }}
            >
              Change password
            </button>
            <button
              className="user-card-buttons delete-user"
              onClick={() => {
                setShowDeleteConfirmationModal(true)
              }}
            >
              Delete account
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default UserCard
