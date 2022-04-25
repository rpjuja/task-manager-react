import React from 'react'
import UserItem from './UserItem'

import './UserList.css'

const UserList = (props) => {
  if (props.users.length > 0) {
    // Sort alphabetically
    props.users.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
  }

  return (
    <div className="user-list">
      {props.users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
          password={user.password}
          isAdmin={user.isadmin}
          removeUser={props.removeUser}
          update={props.updateList}
        />
      ))}
    </div>
  )
}

export default UserList
