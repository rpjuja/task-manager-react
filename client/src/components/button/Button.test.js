import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import Button from './Button.js'

describe('Button', () => {
  it('Should render a normal button', () => {
    render(<Button onClick={() => {}}>My Normal Button</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'button button--default undefined undefined'
    )
    expect(
      screen.getByRole('button', { name: 'My Normal Button' })
    ).toBeInTheDocument()
  })

  it('Should render an anchor', () => {
    render(
      <Button href={'/users'} onClick={() => {}}>
        My Anchor Button
      </Button>
    )
    expect(screen.getByRole('link')).toHaveClass(
      'button button--default undefined undefined'
    )
    expect(
      screen.getByRole('link', { name: 'My Anchor Button' })
    ).toBeInTheDocument()
  })

  it('Should render a route link', () => {
    render(
      <BrowserRouter>
        <Button to={'/users'} onClick={() => {}}>
          My Link Button
        </Button>
      </BrowserRouter>
    )
    expect(screen.getByRole('link')).toHaveClass(
      'button button--default undefined undefined'
    )
    expect(
      screen.getByRole('link', { name: 'My Link Button' })
    ).toBeInTheDocument()
  })
})
