import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders the message inside an alert", () => {
    render(<ErrorMessage message="boom" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("boom");
  });
});
