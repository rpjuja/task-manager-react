import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/Auth-context";

import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext); //Linking our AuthContext from app

  return (
    <ul className="nav-links">
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/" exact>
            AUTHENTICATE
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn &&
        auth.isAdmin && (
          <li>
            <NavLink to={`/users/`} exact>
              USERS
            </NavLink>
          </li>
        )}
      {auth.isLoggedIn &&
        !auth.isAdmin && (
          <li>
            <NavLink to={`/users/`} exact>
              ACCOUNT INFORMATION
            </NavLink>
          </li>
        )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
