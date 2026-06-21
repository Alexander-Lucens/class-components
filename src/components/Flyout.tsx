"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearSelection, selectSelectedItems } from "../features/selectionSlice";

export default function Flyout() {
  const t = useTranslations("Flyout");
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedItems);
  const itemsJson = useMemo(() => JSON.stringify(selected), [selected]);

  if (!selected.length) return null;

  return (
    <div className="flyout" role="status" aria-live="polite">
      <div className="flyout__content">
        <div className="flyout__count">
          {t("selected", { count: selected.length })}
        </div>
        <button
          type="button"
          className="flyout__button flyout__button--secondary"
          onClick={() => dispatch(clearSelection())}
        >
          {t("unselectAll")}
        </button>
        {/* CSV is generated and served by the /api/csv route handler (server). */}
        <form method="post" action="/api/csv" className="flyout__form">
          <input type="hidden" name="items" value={itemsJson} />
          <button
            type="submit"
            className="flyout__button flyout__button--primary"
          >
            {t("download")}
          </button>
        </form>
      </div>
    </div>
  );
}
