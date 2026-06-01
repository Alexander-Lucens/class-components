import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { render, screen, waitFor } from "../../test-utils";
import MainPage from "../MainPage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  fetchPokemonPage: vi.fn(),
  fetchPokemonByTerm: vi.fn(),
}));

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

vi.mock("../../api/fetch-data-api", () => apiMocks);

describe("MainPage coverage branches", () => {
  beforeEach(() => {
    localStorage.clear();
    apiMocks.fetchPokemonPage.mockReset();
    apiMocks.fetchPokemonByTerm.mockReset();
  });

  it("navigates to details and back from a card", async () => {
    apiMocks.fetchPokemonPage.mockResolvedValue({
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", description: "A seed" }],
      hasNext: true,
    });

    const user = userEvent.setup();

    render(<MainPage />, { initialEntries: ["/?page=1"] });

    await screen.findByRole("heading", { name: /bulbasaur/i });

    await user.click(screen.getByRole("heading", { name: /bulbasaur/i }));

    expect(await screen.findByRole("button", { name: /Close details/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Close details/i }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Close details/i })).not.toBeInTheDocument();
    });
  });

  it("calls fetchPokemonPage for next page when hasNext is true", async () => {
    apiMocks.fetchPokemonPage.mockResolvedValue({
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", description: "A seed" }],
      hasNext: true,
    });

    const user = userEvent.setup();

    render(<MainPage />, { initialEntries: ["/?page=1"] });

    await screen.findByRole("button", { name: /Next/i });
    await user.click(screen.getByRole("button", { name: /Next/i }));

    await waitFor(() => {
      expect(apiMocks.fetchPokemonPage).toHaveBeenCalledWith(1, 20);
    });
  });

  it("calls fetchPokemonPage for previous page when currentPage is greater than 1", async () => {
    apiMocks.fetchPokemonPage.mockResolvedValue({
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", description: "A seed" }],
      hasNext: true,
    });

    const user = userEvent.setup();

    render(<MainPage />, { initialEntries: ["/?page=2"] });

    await screen.findByText(/Page 2/i);
    await user.click(screen.getByRole("button", { name: /Prev/i }));

    await waitFor(() => {
      expect(apiMocks.fetchPokemonPage).toHaveBeenCalledWith(0, 20);
    });
  });

  it("shows an error when a search fetch fails", async () => {
    apiMocks.fetchPokemonPage.mockResolvedValue({
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", description: "A seed" }],
      hasNext: false,
    });
    apiMocks.fetchPokemonByTerm.mockRejectedValue(new Error("Search failure"));

    const user = userEvent.setup();

    render(<MainPage />);

    await screen.findByRole("heading", { name: /bulbasaur/i });

    const searchInput = screen.getByPlaceholderText(/Search Pokémon/i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    await user.clear(searchInput);
    await user.type(searchInput, "pikachu");
    await user.click(searchButton);

    expect(await screen.findByText(/Search failure/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong:/i)).toBeInTheDocument();
  });

  it("ignores stale search results after unmount", async () => {
    const deferred = createDeferred<Array<{ name: string; url: string; description: string }>>();
    apiMocks.fetchPokemonByTerm.mockReturnValue(deferred.promise);
    localStorage.setItem("searchTerm", "pikachu");

    const { unmount } = render(<MainPage />);

    expect(apiMocks.fetchPokemonByTerm).toHaveBeenCalledWith("pikachu");

    unmount();

    await act(async () => {
      deferred.resolve([{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/", description: "Electric" }]);
      await deferred.promise;
    });
  });

  it("ignores stale page results after unmount", async () => {
    const deferred = createDeferred<{ results: Array<{ name: string; url: string; description: string }>; hasNext: boolean }>();
    apiMocks.fetchPokemonPage.mockReturnValue(deferred.promise);

    const { unmount } = render(<MainPage />);

    expect(apiMocks.fetchPokemonPage).toHaveBeenCalledWith(0, 20);

    unmount();

    await act(async () => {
      deferred.resolve({
        results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/", description: "A seed" }],
        hasNext: true,
      });
      await deferred.promise;
    });
  });
});