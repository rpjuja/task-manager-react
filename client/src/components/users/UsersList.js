import React from "react";
import UserItem from "./UserItem";

import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  } else {
    // Sort alphabetically
    props.items.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  return (
    <div className="users-list">
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
  );
};

export default UsersList;
