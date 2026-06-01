import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import ErrorBoundary from "../ErrorBoundary";
import { vi } from "vitest";

function Bomb(): ReactElement {
  throw new Error("boom");
}

describe("ErrorBoundary onReset", () => {
  it("renders fallback and calls onReset when reset clicked", () => {
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeDefined();
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onReset).toHaveBeenCalled();
  });
});
