"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function RefreshButton() {
  const router = useRouter();
  const t = useTranslations("Search");
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-refresh"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      aria-label={t("refresh")}
    >
      {t("refresh")}
    </button>
  );
}
