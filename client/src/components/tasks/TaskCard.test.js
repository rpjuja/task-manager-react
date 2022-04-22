import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import TaskCard from './TaskCard.js'
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

  const DUMMY_TASK = {
    id: 'task1',
    title: 'Finish the physics presentation',
    description: 'Finish the persentation about theory of relativity',
    status: 1,
    deadline: '2022-04-22T14:00:00.000Z',
    list_id: DUMMY_TASKLIST.id
  }

  it('Should show task information and link to expand and collapse description', () => {
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
          <TaskCard
            id={DUMMY_TASK.id}
            title={DUMMY_TASK.title}
            description={DUMMY_TASK.description}
            deadline={DUMMY_TASK.deadline}
            status={DUMMY_TASK.status}
          />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByRole('listitem')).toHaveClass('task-card')
    expect(
      screen.getByText('Finish the physics presentation')
    ).toBeInTheDocument()
    expect(screen.getByText('22-04-2022 14:00')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'More Details' })).toHaveAttribute(
      'href',
      '#showtask1'
    )
    // Click for more details and show description
    fireEvent.click(screen.getByRole('link', { name: 'More Details' }))
    // Link should change to Less Details
    expect(screen.getByRole('link', { name: 'Less Details' })).toHaveAttribute(
      'href',
      '#/'
    )
    expect(
      screen.getByTestId('task-description', {
        name: 'Finish the persentation about theory of relativity'
      })
    ).toBeInTheDocument()
    // Hide description
    fireEvent.click(screen.getByRole('link', { name: 'Less Details' }))
  })

  it('Should show dropdown menu, correct statuses to switch and editing modal', () => {
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
          <TaskCard
            id={DUMMY_TASK.id}
            title={DUMMY_TASK.title}
            description={DUMMY_TASK.description}
            deadline={DUMMY_TASK.deadline}
            status={DUMMY_TASK.status}
          />
        </BrowserRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByRole('button', { name: '☰' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '☰' }))
    expect(
      screen.getByRole('button', { name: 'Switch Status' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()

    // Check that correct status options are shown when switch status is clicked
    fireEvent.click(screen.getByRole('button', { name: 'Switch Status' }))
    expect(screen.getByRole('button', { name: 'Backlog' })).toBeInTheDocument()
    expect(screen.queryByText('In Progress')).toBeNull()
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()

    // Test that edit task modal exists
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Description' })
    ).toBeInTheDocument()
    expect(screen.getByText('Deadline')).toBeInTheDocument()
    expect(screen.getByTestId('edit-date-input')).toBeInTheDocument()
    expect(screen.getByTestId('edit-time-input')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
