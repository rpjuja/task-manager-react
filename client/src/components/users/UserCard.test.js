import React from 'react'
import '@testing-library/jest-dom'
import { render, screen} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import UserCard from './UserCard.js'
import { AuthContext } from '../../context/Auth-context.js'

describe('UserItem', () => {
  const DUMMY_USER = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@doe.com',
    isAdmin: false
  }

  it('Should show the user card', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: DUMMY_USER.id,
          isAdmin: DUMMY_USER.isAdmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <UserCard key={'key_1'} user={DUMMY_USER} />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@doe.com')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Change password' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Delete account' })
    ).toBeInTheDocument()

    // Check that modal is in the background
    expect(screen.getByText('Current password')).toBeInTheDocument()
    expect(screen.getByText('New password')).toBeInTheDocument()
    expect(screen.getByText('New password again')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()

  })
})
