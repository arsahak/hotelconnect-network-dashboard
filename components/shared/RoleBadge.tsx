"use client";

import { useTranslations } from "next-intl";
import type { UserRole } from "@/config/access";
import { cn } from "@/lib/utils";

const ROLE_BADGE: Record<UserRole, string> = {
  superadmin: "bg-brass-500 text-white",
  admin: "bg-brass-100 text-brass-700",
  hotel_manager: "bg-moss-100 text-moss-600",
  hotel_staff: "bg-gray-100 text-gray-700",
  supplier: "bg-sand text-ink-700 ring-1 ring-line",
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  const t = useTranslations("Roles");
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        ROLE_BADGE[role],
        className,
      )}
    >
      {t(role)}
    </span>
  );
}
