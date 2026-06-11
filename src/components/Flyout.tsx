import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { clearSelection, selectSelectedItems } from "../features/selectionSlice";
import { exportSelectedToCsv } from "../utils/csv";

export default function Flyout() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectSelectedItems);
  const label = useMemo(() => `${selected.length} selected`, [selected.length]);

  if (!selected.length) return null;

  const handleDownload = () => {
    exportSelectedToCsv(selected);
  };

  return (
    <div className="flyout" role="status" aria-live="polite">
      <div className="flyout__content">
        <div className="flyout__count">{label}</div>
        <button className="flyout__button flyout__button--secondary" onClick={() => dispatch(clearSelection())}>
          Unselect all
        </button>
        <button className="flyout__button flyout__button--primary" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}
