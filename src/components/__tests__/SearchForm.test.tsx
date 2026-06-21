import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test-utils";
import SearchForm from "../SearchForm";

vi.mock("../../lib/actions", () => ({
  searchAction: vi.fn(),
}));

describe("SearchForm", () => {
  it("renders the localized input with the current query and a submit button", () => {
    render(<SearchForm defaultValue="pikachu" />);

    const input = screen.getByPlaceholderText("Search Pokémon...");
    expect(input).toHaveValue("pikachu");
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});
