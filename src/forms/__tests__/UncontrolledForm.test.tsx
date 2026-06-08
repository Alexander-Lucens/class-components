import { render, screen, fireEvent, waitFor } from '../../test-utils'
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

  it('shows name error when first letter is lowercase', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'alice' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/uppercase/i)).toBeInTheDocument())
  })

  it('shows email error for invalid address', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'notvalid' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/invalid email/i)).toBeInTheDocument())
  })

  it('shows age error for negative value', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^age$/i), { target: { value: '-1' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/non-negative/i)).toBeInTheDocument())
  })

  it('shows confirm password error when passwords do not match', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Pass1!ab' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Different1!' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/match/i)).toBeInTheDocument())
  })

  it('shows country error for value not in list', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^country$/i), { target: { value: 'Narnia' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/list/i)).toBeInTheDocument())
  })

  it('shows terms error when terms not accepted', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/terms/i)).toBeInTheDocument())
  })

  it('shows password strength indicator while typing password', () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Ab1!' } })
    expect(screen.getByRole('list', { name: /password strength/i })).toBeInTheDocument()
  })

  it('shows gender error when no gender radio is selected', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/select a gender/i)).toBeInTheDocument())
  })

  it('shows image type error when a non-image file is provided', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    const txtFile = new File(['data'], 'doc.txt', { type: 'text/plain' })
    const imageInput = screen.getByLabelText(/image/i)
    Object.defineProperty(imageInput, 'files', { value: [txtFile], configurable: true })
    fireEvent.change(imageInput)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(screen.getByText(/PNG and JPEG/i)).toBeInTheDocument())
  })
})
