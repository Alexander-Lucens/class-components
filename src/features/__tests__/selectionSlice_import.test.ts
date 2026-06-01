import { vi } from "vitest";

describe("selectionSlice initial readInitialState behavior", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("handles malformed persisted JSON gracefully", async () => {
    localStorage.setItem("selected_pokemon", "not json");
    const mod = await import("../selectionSlice");
    const reducer = mod.default;
    const state = reducer(undefined, { type: "unknown" });
    expect(Object.keys(state.items)).toHaveLength(0);
  });
});
