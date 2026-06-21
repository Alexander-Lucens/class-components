"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { searchAction } from "../lib/actions";

export default function SearchForm({ defaultValue }: { defaultValue: string }) {
  const t = useTranslations("Search");
  const [, formAction, isPending] = useActionState(searchAction, null);

  return (
    <form action={formAction} className="search">
      <input
        key={defaultValue}
        type="text"
        name="query"
        defaultValue={defaultValue}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
      />
      <button type="submit" disabled={isPending}>
        {t("button")}
      </button>
    </form>
  );
}
