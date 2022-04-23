import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import Authenticate from './Authenticate.js'

describe('Authenticate', () => {
  it('should render the login screen', async () => {
    render(<Authenticate />)
    expect(screen.getByText('Login Required')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
    expect(screen.getByText('Signup instead?')).toBeInTheDocument()
  })
  it('should render the signup screen', async () => {
    render(<Authenticate />)
    //Trigger signup button click
    fireEvent.click(screen.getByText('Signup instead?'))
    //Wait for the rerender
    await screen.findByText('Name')

    await screen.findByText('Login instead?')
  })
})
