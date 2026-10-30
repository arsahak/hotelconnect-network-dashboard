"use client";

import type { MyVacancyStatus } from "@/app/actions/myVacancy";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { pending: "brass", published: "green", closed: "grey" } as const;

export function HotelJobStatusBadge({ status }: { status: MyVacancyStatus }) {
  const t = useTranslations("HotelJobs.status");
  return <StatusBadge tone={TONE[status]}>{t(status)}</StatusBadge>;
}
