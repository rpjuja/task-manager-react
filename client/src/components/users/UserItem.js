import React, { useContext, useState } from 'react'

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
  const [modal, setModal] = useState(false)

  const showModal = () => setModal(true)
  const hideModal = () => setModal(false)

  const deleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/users/${props.id}`,
        'DELETE',
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      props.update()
    } catch (e) {}
  }

  const userPrivileges = () => {
    if (props.isAdmin) return <h2>Admin</h2>
    else return <h2>Standard</h2>
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="user-item">
        {isLoading && <LoadingSpinner asOverlay />}
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
                show={modal}
                handleClose={hideModal}
                update={props.update}
              />
              <Button onClick={showModal}>Edit</Button>
            </div>
          )}
          {(auth.userId === props.id || auth.isAdmin) && (
            <Button danger onClick={deleteHandler}>
              Delete
            </Button>
          )}
        </div>
      </li>
    </React.Fragment>
  )
}

export default UserItem
