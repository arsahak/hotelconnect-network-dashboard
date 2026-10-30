import type { ReactNode } from "react";
import { labelClass } from "../form-styles";

/** Label + control + optional hint, the same in every form. */
export function Field({
  id,
  label,
  required,
  hint,
  children,
  className,
}: {
  id?: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-ember-600">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
