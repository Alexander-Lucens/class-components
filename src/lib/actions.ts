"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "../i18n/navigation";

// Server action wired through useActionState in <SearchForm>. Re-renders the
// server-rendered results by navigating with the new query in the URL.
export async function searchAction(
  _prevState: unknown,
  formData: FormData,
): Promise<null> {
  const query = String(formData.get("query") ?? "").trim();
  const locale = await getLocale();

  redirect({
    href: query
      ? { pathname: "/", query: { query, page: "1" } }
      : { pathname: "/" },
    locale,
  });

  // Unreachable: redirect() throws to perform the navigation.
  return null;
}
