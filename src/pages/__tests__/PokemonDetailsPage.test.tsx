/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '../../test-utils';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Routes, Route } from 'react-router-dom';
import PokemonDetailsPage from '../PokemonDetailsPage';

const originalFetch = globalThis.fetch;

const mockPokemonDetails = {
  id: 1,
  name: 'bulbasaur',
};

const mockSpeciesData = {
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed.',
      language: { name: 'en' },
    },
  ],
};

describe('PokemonDetailsPage', () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const renderWithRouter = (pokemonId: string) => {
    return render(
      <Routes>
        <Route path="/details/:pokemonName" element={<PokemonDetailsPage />} />
      </Routes>,
      { initialEntries: [`/details/${pokemonId}`] }
    );
  };

  it('renders loading spinner initially', () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as typeof globalThis.fetch;

    renderWithRouter('bulbasaur');

    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('loads and displays pokémon details', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent(/bulbasaur/i);
    });

    const idElement = document.querySelector('.pokemon-details__id');
    expect(idElement).toHaveTextContent(/#\d+/); // Check for #1, #2, etc (numeric ID)

    expect(screen.getByText(/A strange seed/i)).toBeInTheDocument();
  });

  it('displays pokémon image', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const img = screen.getByAltText(/bulbasaur/i);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        'src',
        expect.stringContaining('raw.githubusercontent.com')
      );
    });
  });

  it('handles fetch error for pokémon details', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(
      new Error('Failed to fetch Pokemon: 404')
    ) as any;

    renderWithRouter('unknown-pokemon');

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch Pokemon/i)).toBeInTheDocument();
    });
  });

  it('handles fetch error for species data', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockRejectedValueOnce(
        new Error('Failed to fetch species: 404')
      );

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch species/i)).toBeInTheDocument();
    });
  });

  it('normalizes flavor text by removing newlines', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          flavor_text_entries: [
            {
              flavor_text: 'A strange\nseed.\nWith a plant.',
              language: { name: 'en' },
            },
          ],
        }),
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const description = screen.getByText(/A strange seed\. With a plant\./i);
      expect(description).toBeInTheDocument();
    });
  });

  it('uses correct API endpoint for fetch', async () => {
    const fetchMock = vi.fn() as any;
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    globalThis.fetch = fetchMock;

    renderWithRouter('pikachu');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('pokeapi.co/api/v2/pokemon/pikachu')
      );
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('pokeapi.co/api/v2/pokemon-species/1')
      );
    });
  });

  it('renders error message component when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(
      new Error('Network error')
    ) as any;

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const errorDiv = document.querySelector('.error');
      expect(errorDiv).toBeInTheDocument();
    });
  });

  it('displays pokemon details in correct structure', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const details = document.querySelector('.pokemon-details');
      expect(details).toBeInTheDocument();

      const name = screen.getByRole('heading', { level: 2 });
      expect(name).toHaveTextContent(/bulbasaur/i);
    });
  });

  it('handles species fetch error with failed response', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/Species not found for Pokémon: /i)).toBeInTheDocument();
    });
  });

  it('displays default description when no english entry available', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          flavor_text_entries: [
            {
              flavor_text: 'Quelque chose.',
              language: { name: 'fr' },
            },
          ],
        }),
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      expect(screen.getByText(/No description available/i)).toBeInTheDocument();
    });
  });

  it('handles pokemon fetch error with failed response', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    renderWithRouter('unknown');

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch Pokemon/i)).toBeInTheDocument();
    });
  });

  it('displays pokemon info in proper div structure', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const content = document.querySelector('.pokemon-details__content');
      expect(content).toBeInTheDocument();

      const info = document.querySelector('.pokemon-details__info');
      expect(info).toBeInTheDocument();
    });
  });

  it('constructs correct image URL from pokemon id', async () => {
    globalThis.fetch = vi.fn() as any;
    (globalThis.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSpeciesData,
      });

    renderWithRouter('bulbasaur');

    await waitFor(() => {
      const img = screen.getByAltText(/bulbasaur/i);
      expect(img).toHaveAttribute('src', expect.stringMatching(/sprites\/pokemon\/\d+\.png/)); // Check for numeric ID in URL
    });
  });
});
