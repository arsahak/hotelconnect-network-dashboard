"use client";

import type { RegistrationStatus } from "@/app/actions/registration";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useTranslations } from "next-intl";

const TONE = { pending: "brass", approved: "green", rejected: "red" } as const;

export function RegistrationStatusBadge({ status }: { status: RegistrationStatus }) {
  const t = useTranslations("Registrations.status");
  return <StatusBadge tone={TONE[status]}>{t(status)}</StatusBadge>;
}
