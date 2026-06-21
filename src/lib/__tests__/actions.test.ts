import { describe, expect, it, vi, beforeEach } from "vitest";

const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("next-intl/server", () => ({ getLocale: async () => "en" }));
vi.mock("../../i18n/navigation", () => ({ redirect }));

import { searchAction } from "../actions";

describe("searchAction", () => {
  beforeEach(() => redirect.mockReset());

  it("redirects with the trimmed query and resets to page 1", async () => {
    const formData = new FormData();
    formData.set("query", "  pikachu  ");

    await searchAction(null, formData);

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: "/", query: { query: "pikachu", page: "1" } },
      locale: "en",
    });
  });

  it("redirects to the bare home path when the query is empty", async () => {
    const formData = new FormData();
    formData.set("query", "   ");

    await searchAction(null, formData);

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: "/" },
      locale: "en",
    });
  });

  it("treats a missing query field as empty", async () => {
    await searchAction(null, new FormData());

    expect(redirect).toHaveBeenCalledWith({
      href: { pathname: "/" },
      locale: "en",
    });
  });
});
