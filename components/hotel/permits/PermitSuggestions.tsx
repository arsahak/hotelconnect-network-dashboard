"use client";

import { useTranslations } from "next-intl";
import { BiPlus } from "react-icons/bi";

/**
 * Permits that hotels like this one usually need (from the hotel type). Ones
 * already in the list are left out; a click starts adding that permit.
 */
export function PermitSuggestions({
  suggestions,
  existing,
  onPick,
}: {
  suggestions: string[];
  existing: string[];
  onPick: (label: string) => void;
}) {
  const t = useTranslations("Compliance");
  const have = new Set(existing.map((type) => type.trim().toLowerCase()));
  const open = suggestions.map((key) => t(`permits.${key}`)).filter((label) => !have.has(label.toLowerCase()));
  if (open.length === 0) return null;

  return (
    <div className="rounded border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">{t("title")}</h2>
      <p className="mt-1 text-xs text-gray-500">{t("description")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {open.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onPick(label)}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary-dark"
          >
            <BiPlus size={14} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
