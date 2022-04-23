import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import UserItem from './UserItem.js'
import { AuthContext } from '../../context/Auth-context.js'

describe('UserItem', () => {
  const DUMMY_USER = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@doe.com',
    isAdmin: false
  }

  it('Should show the user item', () => {
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
          <UserItem
            key={'key_1'}
            id={DUMMY_USER.id}
            name={DUMMY_USER.name}
            email={DUMMY_USER.email}
            isAdmin={DUMMY_USER.isAdmin}
          />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@doe.com')).toBeInTheDocument()
    expect(screen.getByText('Standard User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByTestId('user-delete-button')).toBeInTheDocument()
  })

  it('Should show the user edit modal when edit is clicked', async () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: 'user1',
          isAdmin: DUMMY_USER.isAdmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <UserItem
            key={'key_1'}
            id={DUMMY_USER.id}
            name={DUMMY_USER.name}
            email={DUMMY_USER.email}
            isAdmin={DUMMY_USER.isAdmin}
          />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText(DUMMY_USER.name)).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  })

  // it('Should show the confirmation modal when delete is clicked', async () => {
  //   render(
  //     <AuthContext.Provider
  //       value={{
  //         isLoggedIn: true,
  //         token: '1234567890-0987654321',
  //         userId: 'user1',
  //         isAdmin: DUMMY_USER.isAdmin,
  //         login: () => {},
  //         logout: () => {}
  //       }}
  //     >
  //       <BrowserRouter>
  //         <UserItem
  //           key={'key_1'}
  //           id={DUMMY_USER.id}
  //           name={DUMMY_USER.name}
  //           email={DUMMY_USER.email}
  //           isAdmin={DUMMY_USER.isAdmin}
  //         />
  //       </BrowserRouter>
  //     </AuthContext.Provider>
  //   )

  //   fireEvent.click(screen.getByTestId('user-delete-button'))
  //   expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  //   expect(
  //     screen.getByText('You will lose all tasks and workspaces as well.')
  //   ).toBeInTheDocument()
  //   fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  //   fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
  //   fireEvent.click(screen.getByText('Cancel'))
  // })

  it('Should contain some certain classes', () => {
    render(
      <BrowserRouter>
        <UserItem
          key={'key_1'}
          id={DUMMY_USER.id}
          name={DUMMY_USER.name}
          email={DUMMY_USER.email}
          isAdmin={DUMMY_USER.isAdmin}
        />
      </BrowserRouter>
    )
    expect(screen.getByRole('listitem')).toHaveClass('user-item')
  })
})
