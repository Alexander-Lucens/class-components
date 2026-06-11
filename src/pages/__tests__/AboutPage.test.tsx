import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils";
import AboutPage from "../AboutPage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const triggerError = vi.fn();

vi.mock("../../context/useAppContext", () => ({
  useAppContext: () => ({
    triggerError,
  }),
}));

describe("AboutPage", () => {
  beforeEach(() => {
    triggerError.mockClear();
  });

  it("renders the current about page structure", () => {
    render(<AboutPage />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /About PokéSearch/i })).toBeInTheDocument();

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toHaveTextContent(/Course/i);
    expect(headings[1]).toHaveTextContent(/Pokemon API/i);
    expect(headings[2]).toHaveTextContent(/Created by/i);

    expect(screen.getByText(/This application was created as part of the React course/i)).toBeInTheDocument();
    expect(screen.getByText(/All Pokémon data is fetched from the/i)).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === "This application was created by olucens.")).toBeInTheDocument();
  });

  it("renders external links with the expected attributes", () => {
    render(<AboutPage />);

    const rsLink = screen.getByRole("link", { name: /RS School/i });
    expect(rsLink).toHaveAttribute("href", "https://rs.school/courses/reactjs");
    expect(rsLink).toHaveAttribute("target", "_blank");
    expect(rsLink).toHaveAttribute("rel", "noopener noreferrer");

    const pokeapiLink = screen.getByRole("link", { name: /PokéAPI/i });
    expect(pokeapiLink).toHaveAttribute("href", "https://pokeapi.co");
    expect(pokeapiLink).toHaveAttribute("target", "_blank");
    expect(pokeapiLink).toHaveAttribute("rel", "noopener noreferrer");

    const githubLink = screen.getByRole("link", { name: /olucens/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/olucens/");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the error trigger button and calls context action on click", async () => {
    const user = userEvent.setup();

    render(<AboutPage />);

    const button = screen.getByRole("button", { name: /Trigger Error/i });
    expect(button).toHaveClass("error-trigger");

    await user.click(button);
    expect(triggerError).toHaveBeenCalledTimes(1);
  });
});