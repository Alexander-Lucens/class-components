import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils";
import Card from "../Card";

vi.mock("../../i18n/navigation", () => ({
  Link: ({
    children,
    className,
  }: {
    children?: ReactNode;
    href?: unknown;
    className?: string;
  }) => <a className={className}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

const props = {
  name: "bulbasaur",
  url: "https://pokeapi.co/api/v2/pokemon/1/",
  description: "Seed Pokémon",
  detailsQuery: { details: "bulbasaur" },
  active: false,
};

describe("Card", () => {
  it("renders name, id, image and description", () => {
    render(<Card {...props} />);
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByAltText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Seed Pokémon")).toBeInTheDocument();
  });

  it("toggles selection in the store via the checkbox", async () => {
    const user = userEvent.setup();
    const { store } = render(<Card {...props} />);

    const checkbox = screen.getByRole("checkbox", { name: /select bulbasaur/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(store.getState().selection.items.bulbasaur).toBeDefined();
  });
});
