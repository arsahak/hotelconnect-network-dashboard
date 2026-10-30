"use client";

import type { VacancyStatus } from "@/app/actions/vacancy";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { pending: "brass", published: "green", closed: "grey" } as const;

export function JobStatusBadge({ status }: { status: VacancyStatus }) {
  const t = useTranslations("Jobs");
  return <StatusBadge tone={TONE[status]}>{t(`statuses.${status}`)}</StatusBadge>;
}
