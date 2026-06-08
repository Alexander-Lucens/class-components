import { render, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import UncontrolledForm from '../UncontrolledForm'
import { store } from '../../store'
import { clearSubmissions, selectSubmissions } from '../../features/formsSlice'

vi.mock('../../utils/imageUtils', () => ({
  fileToBase64: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
}))

const PNG_FILE = new File(['x'], 'photo.png', { type: 'image/png' })

function fillForm() {
  fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alice' } })
  fireEvent.change(screen.getByLabelText(/^age$/i), { target: { value: '25' } })
  fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'alice@example.com' } })
  fireEvent.click(screen.getByLabelText(/^female$/i))
  fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Pass1!ab' } })
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Pass1!ab' } })
  fireEvent.change(screen.getByLabelText(/^country$/i), { target: { value: 'Germany' } })
  const imageInput = screen.getByLabelText(/image/i)
  Object.defineProperty(imageInput, 'files', { value: [PNG_FILE], configurable: true })
  fireEvent.change(imageInput)
  fireEvent.click(screen.getByLabelText(/terms/i))
}

beforeEach(() => store.dispatch(clearSubmissions()))
afterEach(() => store.dispatch(clearSubmissions()))

describe('UncontrolledForm submission', () => {
  it('calls onClose after valid submission', async () => {
    const onClose = vi.fn()
    render(<UncontrolledForm onClose={onClose} />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('dispatches addSubmission with correct data', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      const submissions = selectSubmissions(store.getState())
      expect(submissions).toHaveLength(1)
      expect(submissions[0].name).toBe('Alice')
      expect(submissions[0].email).toBe('alice@example.com')
      expect(submissions[0].isNew).toBe(true)
    })
  })

  it('shows validation error when name is missing', async () => {
    render(<UncontrolledForm onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })
})
