import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAppContext } from "../useAppContext";

function Consumer() {
  useAppContext();
  return null;
}

describe("useAppContext", () => {
  it("throws when used outside AppProvider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(/useAppContext must be used within AppProvider/);

    errorSpy.mockRestore();
  });
});