import { render, screen, waitFor } from '../../test-utils'
import Flyout from '../Flyout'
import { describe, expect, it, beforeEach } from 'vitest'

describe('Flyout', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('is hidden when nothing is selected', () => {
    render(<Flyout />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows selection count and clears persisted selection', async () => {
    window.localStorage.setItem(
      'selected_pokemon',
      JSON.stringify([{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', description: 'Seed Pokémon' }]),
    )

    render(<Flyout />)

    await waitFor(() => {
      expect(screen.getByText(/1 selected/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
  })
})
