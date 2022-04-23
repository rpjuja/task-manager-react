import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import TaskLists from './TaskLists.js'
import { AuthContext } from '../../context/Auth-context.js'

describe('TaskLists', () => {
  const DUMMY_USER = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@doe.com',
    isadmin: false
  }
  const DUMMY_TASKLISTS = [
    {
      id: 'tasklist1',
      name: 'School work',
      creator: DUMMY_USER.id
    },
    {
      id: 'tasklist2',
      name: 'Home chores',
      creator: DUMMY_USER.id
    }
  ]

  it('Should ask to create first workspace if user has no workspaces', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: DUMMY_USER.id,
          isAdmin: DUMMY_USER.isadmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <TaskLists lists={[]} />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Create your first workspace')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: /ws-name-input/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('Should show the workspace selection when user has workspaces and switch between them', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: DUMMY_USER.id,
          isAdmin: DUMMY_USER.isadmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <TaskLists lists={DUMMY_TASKLISTS} changeSelectedList={() => {}} />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Select workspace')).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: /list-select/i })
    ).toBeInTheDocument()
    // Options can't be tested with toBeInTheDocument because they always exist in the document
    expect(
      screen.getByRole('option', { name: 'School work' }).selected
    ).toBeTruthy()
    expect(screen.getAllByRole('option').length).toBe(2)

    // Change dropdown to second tasklist
    fireEvent.change(screen.getByRole('combobox', { name: /list-select/i }), {
      target: { value: 'tasklist2' }
    })
    // Selected tasklist should be the other tasklist now
    expect(
      screen.getByRole('option', { name: 'Home chores' }).selected
    ).toBeTruthy()
  })

  it('Should show buttons for adding and removing a tasklist with some functionality', () => {
    render(
      <AuthContext.Provider
        value={{
          isLoggedIn: true,
          token: '1234567890-0987654321',
          userId: DUMMY_USER.id,
          isAdmin: DUMMY_USER.isadmin,
          login: () => {},
          logout: () => {}
        }}
      >
        <BrowserRouter>
          <TaskLists
            lists={DUMMY_TASKLISTS}
            selectedList={DUMMY_TASKLISTS[0]}
          />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByTestId('new-ws-button')).toBeInTheDocument()
    expect(screen.getByTestId('delete-ws-button')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('new-ws-button'))
    expect(
      screen.getByRole('textbox', { name: /new-ws-name-input/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '+ Add workspace' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('new-ws-button'))
  })
})
