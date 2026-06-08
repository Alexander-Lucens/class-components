import { render, screen } from '../../test-utils'
import { describe, expect, it } from 'vitest'
import PasswordStrength from '../PasswordStrength'

describe('PasswordStrength', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrength password="" />)
    expect(container.firstChild).toBeNull()
  })

  it('shows all criteria when password is fully strong', () => {
    render(<PasswordStrength password="Abcdef1!" />)
    const list = screen.getByRole('list', { name: /password strength/i })
    const items = list.querySelectorAll('li')
    items.forEach((item) => {
      expect(item.getAttribute('data-met')).toBe('true')
    })
  })

  it('marks length criterion as met when password has 8+ chars', () => {
    render(<PasswordStrength password="abcdefgh" />)
    const items = screen.getAllByRole('listitem')
    expect(items[0].getAttribute('data-met')).toBe('true')
    expect(items[1].getAttribute('data-met')).toBe('false')
  })

  it('marks uppercase criterion as met', () => {
    render(<PasswordStrength password="ABCDEFGH" />)
    const items = screen.getAllByRole('listitem')
    expect(items[1].getAttribute('data-met')).toBe('true')
  })

  it('marks number criterion as met', () => {
    render(<PasswordStrength password="abc12345" />)
    const items = screen.getAllByRole('listitem')
    expect(items[2].getAttribute('data-met')).toBe('true')
  })

  it('marks special character criterion as met', () => {
    render(<PasswordStrength password="abc!def" />)
    const items = screen.getAllByRole('listitem')
    expect(items[3].getAttribute('data-met')).toBe('true')
  })
})
