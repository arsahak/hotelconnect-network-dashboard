"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** With `pageSize`, the bar also says "Showing 11–20 of 1,348". */
  totalItems?: number;
  pageSize?: number;
  /** With `onPageSizeChange`, a rows-per-page picker is shown. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

// Past seven pages the control always has exactly seven slots: the first and
// last page, the current one with a neighbour either side, and "…" where
// pages are skipped. A fixed number of slots keeps the buttons where they
// are from one page to the next, instead of the row reshuffling under the
// cursor on every click.
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) => {
  const t = useTranslations("Pagination");
  const showsSummary = totalItems !== undefined && pageSize !== undefined;
  // A single page needs no buttons — but the summary and the rows-per-page
  // picker stay, or picking a large page size would leave no way back.
  if (totalPages <= 1 && !showsSummary) return null;

  const firstItem = showsSummary ? (currentPage - 1) * pageSize + 1 : 0;
  const lastItem = showsSummary
    ? Math.min(currentPage * pageSize, totalItems)
    : 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3",
        showsSummary ? "justify-between" : "justify-end",
      )}
    >
      {showsSummary && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <span>
            {t.rich("showing", {
              from: totalItems === 0 ? 0 : firstItem,
              to: lastItem,
              total: totalItems,
              strong: (chunks) => <span className="font-semibold text-gray-900">{chunks}</span>,
            })}
          </span>
          {pageSizeOptions && onPageSizeChange && (
            <label className="flex items-center gap-2">
              {t("rowsPerPage")}
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:border-primary focus:outline-none"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label={t("label")}
          className="inline-flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            <BiChevronLeft size={16} />
            {t("back")}
          </button>

          {getPageNumbers(currentPage, totalPages).map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                type="button"
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-semibold tabular-nums transition-colors",
                  p === currentPage
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:bg-gray-100",
                )}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            {t("next")}
            <BiChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
