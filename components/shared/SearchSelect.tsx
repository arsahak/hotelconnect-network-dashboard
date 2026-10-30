"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BiCheck, BiSearch, BiX } from "react-icons/bi";

export interface SearchSelectOption {
  id: string;
  label: string;
  /** Nesting level (0 = top-level). Renders as an indented tree row. */
  depth?: number;
  /** Full "Parent › Child › Grandchild" breadcrumb, shown once selected
   * instead of the bare label so the lineage stays visible when collapsed. */
  fullPath?: string;
}

interface SearchSelectProps {
  options: SearchSelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  /**
   * For an optional field: adds a first row that picks nothing (labelled
   * `clearLabel`) and an × in the box to clear the current choice.
   */
  allowClear?: boolean;
  clearLabel?: string;
  /**
   * For very long lists (a thousand brands): only this many matches are put
   * on screen at a time, with a note to keep typing — so opening the list
   * and typing in it stay instant.
   */
  maxVisible?: number;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

const SearchSelect = ({
  options,
  value,
  onChange,
  placeholder = "Search…",
  emptyText = "No results found.",
  className = "",
  allowClear = false,
  clearLabel = "None",
  maxVisible,
}: SearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === value);
  const selectedLabel = selectedOption?.fullPath || selectedOption?.label || "";

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? options.filter((o) => o.label.toLowerCase().includes(term))
      : options;
  }, [options, query]);
  const visible = maxVisible ? filtered.slice(0, maxVisible) : filtered;
  const hiddenCount = filtered.length - visible.length;

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <BiSearch
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={open ? query : selectedLabel}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          // Enter takes the first match; Escape closes without choosing.
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
              e.currentTarget.blur();
            } else if (e.key === "Enter" && open) {
              e.preventDefault();
              if (visible[0]) {
                choose(visible[0].id);
                e.currentTarget.blur();
              }
            }
          }}
          placeholder={selectedLabel || placeholder}
          className={`${inputClass} pl-8 ${allowClear && value ? "pr-8" : ""}`}
        />
        {allowClear && value && (
          <button
            type="button"
            aria-label="Clear"
            title="Clear"
            // mousedown, so it runs before the box takes focus and opens.
            onMouseDown={(e) => {
              e.preventDefault();
              choose("");
            }}
            className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <BiX size={16} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {allowClear && !query.trim() && (
            <button
              type="button"
              onClick={() => choose("")}
              className={`flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                value ? "text-gray-500" : "bg-primary/5 font-medium text-primary-dark"
              }`}
            >
              <span className="truncate">{clearLabel}</span>
              {!value && <BiCheck size={14} className="ml-auto shrink-0" />}
            </button>
          )}
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">{emptyText}</p>
          ) : (
            visible.map((o) => {
              const depth = o.depth ?? 0;
              const selected = o.id === value;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => choose(o.id)}
                  style={{ paddingLeft: 12 + depth * 18 }}
                  className={`flex w-full items-center gap-1.5 py-2 pr-3 text-left text-sm hover:bg-gray-50 ${
                    selected
                      ? "bg-primary/5 font-medium text-primary-dark"
                      : depth === 0
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                  }`}
                >
                  {depth > 0 && (
                    <span className="shrink-0 text-gray-300">
                      {"·".repeat(depth - 1)}└
                    </span>
                  )}
                  <span className="truncate">{o.label}</span>
                  {selected && (
                    <BiCheck size={14} className="ml-auto shrink-0" />
                  )}
                </button>
              );
            })
          )}
          {hiddenCount > 0 && (
            <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-400">
              {hiddenCount.toLocaleString()} more — keep typing to narrow the
              list.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
