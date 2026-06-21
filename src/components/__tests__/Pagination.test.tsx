import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "../Pagination";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock("../../i18n/navigation", () => ({
  Link: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <a className={className}>{children}</a>
  ),
}));

describe("Pagination", () => {
  it("renders prev/next as links in the middle of the range", async () => {
    const { container } = render(
      await Pagination({ page: 2, hasNext: true, query: "pika" }),
    );
    expect(container.querySelectorAll("a.pagination__btn")).toHaveLength(2);
    expect(container.querySelector(".pagination__btn--disabled")).toBeNull();
  });

  it("disables prev on the first page and next when there is no next", async () => {
    const { container } = render(
      await Pagination({ page: 1, hasNext: false, query: "" }),
    );
    expect(container.querySelectorAll("a.pagination__btn")).toHaveLength(0);
    expect(container.querySelectorAll(".pagination__btn--disabled")).toHaveLength(
      2,
    );
  });
});
