import { cn } from "@/lib/utils";

const TONES = {
  green: "bg-moss-100 text-moss-600",
  red: "bg-ember-100 text-ember-600",
  brass: "bg-brass-100 text-brass-700",
  grey: "bg-gray-100 text-gray-600",
} as const;

/** Small coloured status pill with a dot ("Active", "Published", …). */
export function StatusBadge({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium", TONES[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
