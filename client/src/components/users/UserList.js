import React from 'react'
import UserItem from './UserItem'

import './UserList.css'

const UserList = (props) => {
  if (props.items.length > 0) {
    // Sort alphabetically
    props.items.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
  }

  return (
    <div className="user-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
          password={user.password}
          isAdmin={user.isadmin}
          update={props.update}
        />
      ))}
    </div>
  )
}

export default UserList
