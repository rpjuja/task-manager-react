import React, { useState, useCallback, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'

import Users from './pages/Users'
import Tasks from './pages/Tasks'
import Authenticate from './pages/Authenticate'
import { AuthContext } from './context/Auth-context'

import MainNavigation from './components/navigation/MainNavigation'

let logoutTimer

function App() {
  const [token, setToken] = useState(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(false)
  const [admin, setAdmin] = useState(false)

  const login = useCallback((uid, token, admin, expirationDate) => {
    //prevent a render loop
    setToken(token)
    setUserId(uid)
    setAdmin(admin)
    //current date in ms + 1h
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        isAdmin: admin,
        expiration: tokenExpirationDate.toISOString()
      })
    )
  }, [])

  const logout = useCallback(() => {
    //prevent a render loop
    setToken(null)
    setUserId(null)
    setAdmin(null)
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // if greater, still in future
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.isAdmin,
        new Date(storedData.expiration)
      )
    }
  }, [login])

  let routes
  if (token) {
    // Redirect to tasks page after login
    routes = (
      <Routes>
        <Route
          exact="true"
          path="/"
          element={<Navigate replace to="/tasks/" />}
        ></Route>
        <Route exact path="/tasks/" element={<Tasks />}></Route>
        <Route exact path="/users/" element={<Users />}></Route>
      </Routes>
    )
  } else {
    // Redirect to authentication page on logout
    routes = (
      <Routes>
        <Route
          exact="true"
          path="/tasks"
          element={<Navigate replace to="/" />}
        ></Route>
        <Route exact path="/" element={<Authenticate />}></Route>
      </Routes>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        isAdmin: admin,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
