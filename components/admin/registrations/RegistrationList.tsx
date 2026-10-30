"use client";

import { listRegistrationsAction } from "@/app/actions/registration";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";
import { TestPhaseCard } from "./TestPhaseCard";

const FILTERS = ["pending", "approved", "rejected", ""] as const;

/** Admin: sign-ups to approve (briefing §3.1, §4.1), with the test phase switch on top. */
const RegistrationList = () => {
  const t = useTranslations("Registrations");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("pending");
  const { data, loading, error } = useApiData(listRegistrationsAction, { status: status || undefined });
  const items = data?.items ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("description")} />
      <TestPhaseCard />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f || "all"}
            type="button"
            aria-pressed={status === f}
            onClick={() => setStatus(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              status === f ? "border-ink-950 bg-ink-950 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {f ? t(`status.${f}`) : t("all")}
            {f === "pending" && data ? ` (${data.pending})` : ""}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("company")}</th>
              <th className="px-5 py-3 font-semibold">{t("type")}</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">{t("contact")}</th>
              <th className="px-5 py-3 font-semibold">{tc("added")}</th>
              <th className="px-5 py-3 font-semibold">{tc("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={5} loading={loading} error={error} empty={items.length === 0} emptyText={t("empty")} />
            {!loading &&
              items.map((r) => (
                <tr key={r._id} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/registrations/${r._id}`} className="font-medium text-gray-900 hover:text-primary-dark">
                      {r.companyName}
                    </Link>
                    <span className="block text-xs text-gray-500">KVK {r.kvkNumber}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{t(`types.${r.type}`)}</td>
                  <td className="hidden px-5 py-3 text-gray-700 md:table-cell">
                    {[r.contactFirstName, r.contactLastName].filter(Boolean).join(" ")}
                    <span className="block text-xs text-gray-500">{r.email}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{format.dateTime(new Date(r.createdAt), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-3">
                    <RegistrationStatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationList;
