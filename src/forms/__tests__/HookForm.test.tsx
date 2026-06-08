import { render, screen, waitFor, fireEvent } from '../../test-utils'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import HookForm from '../HookForm'

describe('HookForm', () => {
  it('renders name input with connected label', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('renders age input with connected label', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
  })

  it('renders email input with connected label', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders gender radio buttons', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/^male$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^female$/i)).toBeInTheDocument()
  })

  it('renders terms checkbox with connected label', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByLabelText(/terms/i)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows name error when first letter is lowercase', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^name$/i), 'alice')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows email error for invalid address', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^email$/i), 'notvalid')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows age error for negative number', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^age$/i), '-5')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows password error when too short', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^password$/i), 'short')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows confirm password error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^password$/i), 'Pass1!ab')
    await user.type(screen.getByLabelText(/confirm password/i), 'Different1!')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows country error for value not in list', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.type(screen.getByLabelText(/^country$/i), 'Narnia')
    await user.tab()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows terms error when terms checkbox is untouched then touched', async () => {
    const user = userEvent.setup()
    render(<HookForm onClose={vi.fn()} />)
    await user.click(screen.getByLabelText(/terms/i))
    await user.click(screen.getByLabelText(/terms/i))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('shows image type error when a non-image file is provided', async () => {
    render(<HookForm onClose={vi.fn()} />)
    const txtFile = new File(['data'], 'doc.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/image/i)
    Object.defineProperty(input, 'files', {
      value: Object.assign([txtFile], { item: () => txtFile, length: 1 }),
      configurable: true,
    })
    fireEvent.change(input)
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
