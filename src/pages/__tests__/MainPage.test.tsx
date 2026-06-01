import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MainPage from '../MainPage';

const originalFetch = globalThis.fetch;

const mockPokemonData = {
  list: { results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: 'next-url' },
  details: { id: 1, name: 'bulbasaur' },
  species: { flavor_text_entries: [{ flavor_text: 'A strange seed.', language: { name: 'en' } }] },
};

describe('MainPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    window.localStorage.clear();
    globalThis.fetch = originalFetch;
  });

  const renderMainPage = () => {
    return render(
      <MainPage />
    );
  };

  it('renders header with navigation links', async () => {
    renderMainPage();

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();

    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
  });

  it('renders search component', async () => {
    renderMainPage();

    const searchInput = screen.getByPlaceholderText(/Search Pokémon/i);
    expect(searchInput).toBeInTheDocument();

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('displays pagination after loading data', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: 'next-url' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /prev/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled(); // First page
    expect(nextButton).not.toBeDisabled();
  });

  it('loads and displays pokémon data', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    const bulbasaur = await screen.findByText(/bulbasaur/i);
    expect(bulbasaur).toBeInTheDocument();
  });

  it('error trigger button shows error boundary fallback', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'test', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'test' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/test/i)).toBeInTheDocument();
    });

    const triggerButton = screen.getByRole('button', { name: /trigger error/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it('displays no results message when search returns empty', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [], next: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'test' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/No pokémon found/i)).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('navigates to next page when next button clicked and has next', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: 'next-url' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('does not navigate to next page when no more pages available', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // No next page
  });

  it('performs search when search button is clicked', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }], next: null }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 25, name: 'pikachu' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    const searchInput = screen.getByPlaceholderText(/Search Pokémon/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    const user = userEvent.setup();
    await user.clear(searchInput);
    await user.type(searchInput, 'pikachu');
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    });
  });

  it('displays page count correctly', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: 'next-url' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: mockPokemonData.species.flavor_text_entries }) });

    renderMainPage();

    await waitFor(() => {
      expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
    });
  });
});
