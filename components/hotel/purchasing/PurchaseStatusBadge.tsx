"use client";

import type { PurchaseStatus } from "@/app/actions/purchase";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { open: "green", negotiating: "brass", completed: "grey" } as const;

export function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
  const t = useTranslations("Purchasing.status");
  return <StatusBadge tone={TONE[status]}>{t(status)}</StatusBadge>;
}
