import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils";
import RefreshButton from "../RefreshButton";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

describe("RefreshButton", () => {
  it("refreshes the route on click", async () => {
    const user = userEvent.setup();
    render(<RefreshButton />);

    await user.click(screen.getByRole("button", { name: /refresh/i }));
    expect(refresh).toHaveBeenCalled();
  });
});
