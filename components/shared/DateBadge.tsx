"use client";

import { useFormatter, useTranslations } from "next-intl";
import { dateStatus, daysUntil } from "@/lib/dates";
import { StatusBadge } from "./StatusBadge";

const TONE = { expired: "red", soon: "brass", ok: "green", none: "grey" } as const;

/** A date with its state: expired (red), within 30 days (brass) or later (green). */
export function DateBadge({ value, empty = "—" }: { value?: string | null; empty?: string }) {
  const t = useTranslations("Dates");
  const format = useFormatter();
  const status = dateStatus(value);
  if (!value || status === "none") return <span className="text-gray-400">{empty}</span>;

  const days = daysUntil(value);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="whitespace-nowrap text-gray-900">{format.dateTime(new Date(value), { dateStyle: "medium", timeZone: "UTC" })}</span>
      <StatusBadge tone={TONE[status]}>
        {status === "expired" ? t("expiredAgo", { days: -days }) : days === 0 ? t("today") : t("inDays", { days })}
      </StatusBadge>
    </span>
  );
}
