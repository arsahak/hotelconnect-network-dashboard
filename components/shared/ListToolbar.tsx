"use client";

import { useTranslations } from "next-intl";
import { BiRefresh, BiSearch } from "react-icons/bi";
import { outlineButtonClass } from "./form-styles";

export interface ToolbarFilter {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** First option, "All …". */
  allLabel: string;
  options: { value: string; label: string }[];
}

/** Search box + dropdown filters + refresh, above every admin list. */
export function ListToolbar({
  search,
  onSearch,
  placeholder,
  filters = [],
  onRefresh,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder: string;
  filters?: ToolbarFilter[];
  onRefresh: () => void;
}) {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4">
      <div className="relative min-w-56 flex-1 sm:max-w-sm">
        <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>
      {filters.map((filter) => (
        <label key={filter.id} className="flex items-center">
          <span className="sr-only">{filter.label}</span>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none"
          >
            <option value="">{filter.allLabel}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button type="button" onClick={onRefresh} className={`${outlineButtonClass} ml-auto`}>
        <BiRefresh size={16} /> {t("refresh")}
      </button>
    </div>
  );
}
