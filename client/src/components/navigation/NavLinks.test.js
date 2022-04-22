import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import NavLinks from './NavLinks'
import { AuthContext } from '../../context/auth-context.js'

describe('Navigation Links', () => {
  it('Should only show the authentication button when not authenticated', () => {
    render(
      <BrowserRouter>
        <NavLinks />
      </BrowserRouter>
    )

    expect(screen.getByRole('list')).toHaveClass('nav-links')
    expect(screen.getByText('AUTHENTICATE')).toBeInTheDocument()
    expect(screen.getByText('AUTHENTICATE')).toHaveAttribute('href', '/')
    expect(screen.queryByText('USERS')).toBeNull()
    expect(screen.queryByText('TASKS')).toBeNull()
  })

  it('Should show certain buttons for an admin user', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: 'user1',
          isAdmin: true,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <NavLinks />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByRole('list')).toHaveClass('nav-links')
    expect(screen.getByText('USERS')).toBeInTheDocument()
    expect(screen.getByText('USERS')).toHaveAttribute('href', '/users/')

    expect(screen.queryByText('AUTHENTICATE')).toBeNull()

    expect(screen.getByText('TASKS')).toBeInTheDocument()
    expect(screen.getByText('TASKS')).toHaveAttribute('href', '/tasks/')

    expect(screen.getByRole('button', { name: 'LOGOUT' })).toBeInTheDocument()
  })

  it('Should show certain buttons for a standard user', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: 'user1',
          isAdmin: false,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <NavLinks />
        </BrowserRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByRole('list')).toHaveClass('nav-links')
    expect(screen.getByText('ACCOUNT INFORMATION')).toBeInTheDocument()
    expect(screen.getByText('ACCOUNT INFORMATION')).toHaveAttribute(
      'href',
      '/users/'
    )

    expect(screen.queryByText('AUTHENTICATE')).toBeNull()

    expect(screen.getByText('TASKS')).toBeInTheDocument()
    expect(screen.getByText('TASKS')).toHaveAttribute('href', '/tasks/')

    expect(screen.getByRole('button', { name: 'LOGOUT' })).toBeInTheDocument()
  })
})
