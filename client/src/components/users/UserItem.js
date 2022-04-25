import React, { useContext, useState } from 'react'

import Modal from '../modal/Modal'
import Button from '../button/Button'
import { AuthContext } from '../../context/Auth-context'

import UserEditModal from './UserEditModal'
import './UserItem.css'

const UserItem = (props) => {
  const auth = useContext(AuthContext)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const userPrivileges = () => {
    if (props.isAdmin) return <p>Admin User</p>
    else return <p>Standard User</p>
  }

  return (
    <React.Fragment>
      <UserEditModal
        id={props.id}
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
            <Button danger onClick={() => props.removeUser(props.id)}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>You will lose all your tasks and workspaces as well.</p>
      </Modal>
      <li className="user-item">
        <div className="user-item__name">
          <p>{props.name}</p>
        </div>
        <div className="user-item__email">
          <p>{props.email}</p>
        </div>
        <div className="user-item__priv">{userPrivileges()}</div>
        <div className="user-item__buttons">
          {auth.userId === props.id && (
            <div className="user-item__edit-button">
              <Button gray onClick={() => setShowEditModal(true)}>
                Edit
              </Button>
            </div>
          )}
          {(auth.userId === props.id || auth.isAdmin) && (
            <Button
              dataTestid="user-delete-button"
              danger
              onClick={() => {
                setShowDeleteConfirmationModal(true)
              }}
            >
              <i className="fa fa-trash"></i>
            </Button>
          )}
        </div>
      </li>
    </React.Fragment>
  )
}

export default UserItem
