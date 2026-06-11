import { render, screen } from '../../test-utils'
import Card from '../Card'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'


describe('Card', () => {
  it('renders name, id and image alt', () => {
    render(<Card name="Bulbasaur" url="https://pokeapi.co/api/v2/pokemon/1/" description="Seed Pokémon" />)

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByAltText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument()
  })

  it('toggles checkbox without triggering card click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<Card name="Bulbasaur" url="https://pokeapi.co/api/v2/pokemon/1/" description="Seed Pokémon" onClick={onClick} />)

    const checkbox = screen.getByRole('checkbox', { name: /select bulbasaur/i })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(onClick).not.toHaveBeenCalled()

    await user.click(screen.getByText('Bulbasaur'))
    expect(onClick).toHaveBeenCalledWith('Bulbasaur')
  })
})
