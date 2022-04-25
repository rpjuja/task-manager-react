import React, { useState, useEffect, useContext } from 'react'

import UserCard from '../components/users/UserCard'
import UserList from '../components/users/UserList'
import ErrorModal from '../components/modal/ErrorModal'
import LoadingSpinner from '../components/loadingspinner/LoadingSpinner'
import { useHttpClient } from '../hooks/http-hook'
import { AuthContext } from '../context/Auth-context'

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [userData, setUserData] = useState()
  // State used to update the list if a user is deleted or edited
  const [toggle, setToggle] = useState(false)
  const userId = auth.userId

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let res
        if (auth.isAdmin) {
          res = await sendRequest(`${process.env.REACT_APP_BACKEND}/users/`)
        } else {
          res = await sendRequest(
            `${process.env.REACT_APP_BACKEND}/users/${userId}`
          )
        }
        setUserData(res.users)
      } catch (err) {}
    }
    fetchUsers()
  }, [userId, auth.isAdmin, sendRequest, toggle]) //We can add sendRequest as dependency because useCallback will prevent a loop

  // Fetch users again and update list by setting state that's in useEffect dependencies
  const updateList = () => {
    setToggle((prevState) => !prevState)
  }

  const removeUserHandler = async (userId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND}/users/${userId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      )
      // Logout if user removes own account
      if (userId === auth.userId) {
        auth.logout()
      }
      setToggle((prevState) => !prevState)
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
      {!isLoading && userData && auth.isAdmin && (
        <UserList
          users={userData}
          removeUser={removeUserHandler}
          update={updateList}
        />
      )}
      {!isLoading && userData && !auth.isAdmin && (
        <UserCard
          user={userData[0]}
          removeUser={removeUserHandler}
          update={updateList}
        />
      )}
    </React.Fragment>
  )
}

export default Users
