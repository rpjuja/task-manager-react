import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import TaskListData from './TaskListData.js'
import { AuthContext } from '../../context/auth-context'

describe('TaskLists', () => {
  const DUMMY_USER = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@doe.com',
    isadmin: false
  }
  const DUMMY_TASKLIST = {
    id: 'tasklist1',
    name: 'School work',
    creator: DUMMY_USER.id
  }

  it('Should show three columns with only new task buttons when empty tasklist is selected', () => {
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
          <TaskListData selectedList={DUMMY_TASKLIST[0]} />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Backlog')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '+ Add task' }).length).toBe(3)

    // Test that add task modal exists
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Description' })
    ).toBeInTheDocument()
    expect(screen.getByText('Deadline')).toBeInTheDocument()
    expect(screen.getByTestId('add-date-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-time-input')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
