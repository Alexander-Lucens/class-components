import { render, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import HookForm from '../HookForm'
import { store } from '../../store'
import { clearSubmissions, selectSubmissions } from '../../features/formsSlice'

vi.mock('../../utils/imageUtils', () => ({
  fileToBase64: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
}))

const PNG_FILE = new File(['x'], 'photo.png', { type: 'image/png' })

beforeEach(() => store.dispatch(clearSubmissions()))
afterEach(() => store.dispatch(clearSubmissions()))

async function fillAndSubmit(onClose = vi.fn()) {
  const user = userEvent.setup()
  render(<HookForm onClose={onClose} />)

  await user.type(screen.getByLabelText(/^name$/i), 'Alice')
  await user.type(screen.getByLabelText(/^age$/i), '25')
  await user.type(screen.getByLabelText(/^email$/i), 'alice@example.com')
  await user.click(screen.getByLabelText(/^female$/i))
  await user.type(screen.getByLabelText(/^password$/i), 'Pass1!ab')
  await user.type(screen.getByLabelText(/confirm password/i), 'Pass1!ab')
  await user.type(screen.getByLabelText(/^country$/i), 'Germany')
  await user.upload(screen.getByLabelText(/image/i), PNG_FILE)
  await user.click(screen.getByLabelText(/terms/i))

  return onClose
}

describe('HookForm submission', () => {
  it('submit button is disabled when form is empty', () => {
    render(<HookForm onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('submit button becomes enabled when form is valid', async () => {
    const onClose = vi.fn()
    await fillAndSubmit(onClose)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
    })
  })

  it('calls onClose after valid submission', async () => {
    const onClose = vi.fn()
    await fillAndSubmit(onClose)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('dispatches addSubmission with correct data', async () => {
    await fillAndSubmit()
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() => {
      const submissions = selectSubmissions(store.getState())
      expect(submissions).toHaveLength(1)
      expect(submissions[0].name).toBe('Alice')
      expect(submissions[0].isNew).toBe(true)
    })
  })
})
