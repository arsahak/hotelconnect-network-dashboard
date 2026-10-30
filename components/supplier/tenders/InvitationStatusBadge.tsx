"use client";

import type { InvitationStatus } from "@/app/actions/supplierTender";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { open: "brass", submitted: "brass", won: "green", lost: "red", expired: "grey", cancelled: "grey" } as const;

export function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const t = useTranslations("SupplierTenders");
  return <StatusBadge tone={TONE[status]}>{t(`status.${status}`)}</StatusBadge>;
}
