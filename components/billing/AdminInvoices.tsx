"use client";

import { adminInvoicesAction } from "@/app/actions/billing";
import { inputClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { InvoiceTable, useMoney } from "./shared";

/** Admin: every invoice — mark bank transfers as paid, cancel mistakes. */
const AdminInvoices = () => {
  const t = useTranslations("Billing");
  const money = useMoney();
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const { data, loading, error, reload } = useApiData(adminInvoicesAction, { status, kind });
  const total = (s: string) => data?.totals.find((x) => x._id === s);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("adminTitle")} description={t("adminSubtitle")} />
      <div className="grid gap-4 sm:grid-cols-3">
        {(["open", "paid", "cancelled"] as const).map((s) => (
          <div key={s} className="rounded border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t(`status.${s}`)}</p>
            <p className="mt-1 font-display text-3xl text-gray-950">{money(total(s)?.total ?? 0)}</p>
            <p className="text-xs text-gray-500">{t("invoiceCount", { count: total(s)?.count ?? 0 })}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} w-auto`} aria-label={t("filterStatus")}>
          <option value="">{t("allStatuses")}</option>
          {(["open", "paid", "cancelled"] as const).map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className={`${inputClass} w-auto`} aria-label={t("filterKind")}>
          <option value="">{t("allKinds")}</option>
          {(["membership", "commission", "advertising", "promotion"] as const).map((k) => (
            <option key={k} value={k}>
              {t(`kind.${k}`)}
            </option>
          ))}
        </select>
      </div>
      <InvoiceTable admin invoices={data?.items ?? []} loading={loading} error={error} onChange={reload} />
    </div>
  );
};

export default AdminInvoices;
