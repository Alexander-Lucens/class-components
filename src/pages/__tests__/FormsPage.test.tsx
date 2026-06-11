import { render, screen, fireEvent } from '../../test-utils'
import { describe, expect, it } from 'vitest'
import FormsPage from '../FormsPage'

describe('FormsPage', () => {
  it('renders the page heading', () => {
    render(<FormsPage />)
    expect(screen.getByRole('heading', { name: /forms/i })).toBeInTheDocument()
  })

  it('renders button to open Uncontrolled Form', () => {
    render(<FormsPage />)
    expect(screen.getByRole('button', { name: /uncontrolled form/i })).toBeInTheDocument()
  })

  it('renders button to open Hook Form', () => {
    render(<FormsPage />)
    expect(screen.getByRole('button', { name: /hook form/i })).toBeInTheDocument()
  })

  it('shows empty state message when no submissions', () => {
    render(<FormsPage />)
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument()
  })

  it('opens Uncontrolled Form modal when its button is clicked', () => {
    render(<FormsPage />)
    fireEvent.click(screen.getByRole('button', { name: /uncontrolled form/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /uncontrolled form/i })).toBeInTheDocument()
  })

  it('opens Hook Form modal when its button is clicked', () => {
    render(<FormsPage />)
    fireEvent.click(screen.getByRole('button', { name: /hook form/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
