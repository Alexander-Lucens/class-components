import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils";
import LocaleSwitcher from "../LocaleSwitcher";

const replace = vi.fn();

vi.mock("../../i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace }),
}));

describe("LocaleSwitcher", () => {
  it("lists the available locales and switches on change", async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    const select = screen.getByRole("combobox", { name: /language/i });
    expect(screen.getByRole("option", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Deutsch" })).toBeInTheDocument();

    await user.selectOptions(select, "de");
    expect(replace).toHaveBeenCalledWith("/", { locale: "de" });
  });
});
