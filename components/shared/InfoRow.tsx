import type { ReactNode } from "react";

/** Icon + label + value, for details pages. */
export function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="break-words text-sm font-medium text-gray-900">{value || "—"}</div>
      </div>
    </div>
  );
}
