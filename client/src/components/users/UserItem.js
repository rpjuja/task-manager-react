import React, { useContext, useState } from 'react'

import Modal from '../modal/Modal'
import Button from '../button/Button'
import LoadingSpinner from '../loadingspinner/LoadingSpinner'
import ErrorModal from '../modal/ErrorModal'
import { AuthContext } from '../../context/Auth-context'
import { useHttpClient } from '../../hooks/http-hook'

import UserEditModal from './UserEditModal'
import './UserItem.css'

const UserItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false)

  const removeUserHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/${props.id}`,
        'DELETE',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      // Logout if user removes own account
      if (props.id === auth.userId) {
        auth.logout()
      }
      props.update()
    } catch (e) {}
  }

  const userPrivileges = () => {
    if (props.isAdmin) return <h2>Admin User</h2>
    else return <h2>Standard User</h2>
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <li className="user-item">
        <div className="user-item__name">
          <h2>{props.name}</h2>
        </div>
        <div className="user-item__email">
          <h2>{props.email}</h2>
        </div>
        <div className="user-item__priv">{userPrivileges()}</div>
        <div className="user-item__buttons">
          {auth.userId === props.id && (
            <div>
              <UserEditModal
                id={props.id}
                name={props.name}
                password={props.password}
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                update={props.update}
              />
              <Button onClick={() => setShowEditModal(true)}>Edit</Button>
            </div>
          )}
          {(auth.userId === props.id || auth.isAdmin) && (
            <div>
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
                    <Button delete danger onClick={removeUserHandler}>
                      Delete
                    </Button>
                  </React.Fragment>
                }
              >
                <p>You will lose all tasks and workspaces as well.</p>
              </Modal>
              <Button
                dataTestid="user-delete-button"
                delete
                danger
                onClick={() => {
                  setShowDeleteConfirmationModal(true)
                }}
              >
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          )}
        </div>
      </li>
    </React.Fragment>
  )
}

export default UserItem
