import { render, screen, act } from '../../test-utils'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import FormsPage from '../FormsPage'
import { store } from '../../store'
import { addSubmission, clearSubmissions } from '../../features/formsSlice'

const sample = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female' as const,
  terms: true,
  image: 'data:image/png;base64,abc',
  password: 'Pass1!ab',
  country: 'Germany',
}

beforeEach(() => store.dispatch(clearSubmissions()))
afterEach(() => store.dispatch(clearSubmissions()))

describe('FormsPage submission display', () => {
  it('shows submission card with name, age, email, country', () => {
    store.dispatch(addSubmission(sample))
    render(<FormsPage />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
    expect(screen.getByText(/alice@example\.com/)).toBeInTheDocument()
    expect(screen.getByText(/Germany/)).toBeInTheDocument()
  })

  it('shows NEW badge for a fresh submission', () => {
    store.dispatch(addSubmission(sample))
    render(<FormsPage />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('shows image when base64 is present', () => {
    store.dispatch(addSubmission(sample))
    render(<FormsPage />)
    const img = screen.getByRole('img', { name: /Alice avatar/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', sample.image)
  })

  it('shows multiple submission cards', () => {
    store.dispatch(addSubmission(sample))
    store.dispatch(addSubmission({ ...sample, name: 'Bob' }))
    render(<FormsPage />)
    expect(screen.getByText(/Alice/)).toBeInTheDocument()
    expect(screen.getByText(/Bob/)).toBeInTheDocument()
  })

  it('newest submission appears first', () => {
    store.dispatch(addSubmission({ ...sample, name: 'First' }))
    store.dispatch(addSubmission({ ...sample, name: 'Second' }))
    render(<FormsPage />)
    const items = screen.getAllByRole('listitem')
    expect(items[0].textContent).toContain('Second')
  })

  it('NEW badge disappears after 3 seconds', async () => {
    vi.useFakeTimers()
    store.dispatch(addSubmission(sample))
    render(<FormsPage />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(3000) })
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})
