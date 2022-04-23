import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import UserList from './UserList.js'
import { AuthContext } from '../../context/Auth-context.js'

describe('UserList', () => {
  const DUMMY_USERS = [
    {
      id: 'user1',
      name: 'Jane Doe',
      email: 'jane@doe.com',
      isadmin: true
    },
    {
      id: 'user2',
      name: 'John Doe',
      email: 'john@doe.com',
      isadmin: false
    }
  ]

  it('Should show list of users for an admin user', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: DUMMY_USERS[0].id,
          isAdmin: DUMMY_USERS[0].isadmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <UserList users={DUMMY_USERS} />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@doe.com')).toBeInTheDocument()
    expect(screen.getByText('john@doe.com')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('Standard User')).toBeInTheDocument()
  })
})
