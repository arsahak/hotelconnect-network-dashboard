"use client";

import type { TenderStatus } from "@/app/actions/tender";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { open: "brass", awarded: "green", cancelled: "grey" } as const;

export function TenderStatusBadge({ status }: { status: TenderStatus }) {
  const t = useTranslations("Tenders");
  return <StatusBadge tone={TONE[status]}>{t(`status.${status}`)}</StatusBadge>;
}
