import { getTranslations } from "next-intl/server";
import { Link } from "../i18n/navigation";

interface PaginationProps {
  page: number;
  hasNext: boolean;
  query: string;
}

export default async function Pagination({
  page,
  hasNext,
  query,
}: PaginationProps) {
  const t = await getTranslations("Results");

  const queryFor = (targetPage: number): Record<string, string> => {
    const result: Record<string, string> = { page: String(targetPage) };
    if (query) result.query = query;
    return result;
  };

  return (
    <div className="pagination">
      {page > 1 ? (
        <Link
          href={{ pathname: "/", query: queryFor(page - 1) }}
          className="pagination__btn"
        >
          {t("prev")}
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          {t("prev")}
        </span>
      )}

      <span>{t("page", { page })}</span>

      {hasNext ? (
        <Link
          href={{ pathname: "/", query: queryFor(page + 1) }}
          className="pagination__btn"
        >
          {t("next")}
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled">
          {t("next")}
        </span>
      )}
    </div>
  );
}
