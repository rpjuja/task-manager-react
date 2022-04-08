import React, { useState, useEffect, useContext } from "react";

import UserList from "../components/users/UserList";
import ErrorModal from "../components/modal/ErrorModal";
import LoadingSpinner from "../components/loadingspinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/Auth-context";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [userData, setUserData] = useState();
  // State used to update the list if a user is deleted or edited
  const [toggle, setToggle] = useState(false);
  const userId = auth.userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users;
        if (auth.isAdmin) {
          users = await sendRequest(`http://localhost:5000/api/users/`);
        } else {
          users = await sendRequest(
            `http://localhost:5000/api/users/${userId}`
          );
        }
        setUserData(users);
      } catch (err) {}
    };
    fetchUsers();
  }, [userId, auth.isAdmin, sendRequest, toggle]); //We can add sendRequest as dependency because useCallback will prevent a loop

  // Fetch users again and update list by setting state that's in useEffect dependencies
  const updateList = () => {
    setToggle((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userData && (
        <UserList items={userData.users} update={updateList} />
      )}
    </React.Fragment>
  );
};

export default Users;
