import { render, screen } from '../../test-utils'
import { describe, expect, it, vi } from 'vitest'
import UncontrolledForm from '../UncontrolledForm'

describe('UncontrolledForm', () => {
  it('renders name input with connected label', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    const label = screen.getByLabelText(/name/i)
    expect(label).toBeInTheDocument()
  })

  it('renders age input with connected label', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
  })

  it('renders email input with connected label', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders gender radio buttons', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/^male$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^female$/i)).toBeInTheDocument()
  })

  it('renders terms checkbox with connected label', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/terms/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
})
