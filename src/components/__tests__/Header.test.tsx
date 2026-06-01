import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import Header from '../Header'

describe('Header theme switcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('switches light, dark, and system theme modes', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button', { name: /dark/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    await user.click(screen.getByRole('button', { name: /light/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    await user.click(screen.getByRole('button', { name: /auto/i }))
    expect(screen.getByRole('button', { name: /auto/i })).toHaveAttribute('aria-pressed', 'true')
  })
})
