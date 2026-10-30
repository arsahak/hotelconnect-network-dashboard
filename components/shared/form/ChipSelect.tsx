"use client";

import { BiCheck } from "react-icons/bi";
import { cn } from "@/lib/utils";

/** Pick several values from a fixed list (categories, regions). */
export function ChipSelect({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  /** Turns a stored value into the text shown. */
  label?: (value: string) => string;
}) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            aria-pressed={selected}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              selected
                ? "border-primary bg-primary/10 text-primary-dark"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
            )}
          >
            {selected && <BiCheck size={14} />}
            {label ? label(option) : option}
          </button>
        );
      })}
    </div>
  );
}
