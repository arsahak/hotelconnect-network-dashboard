"use client";

import { adminListPurchaseActionsAction } from "@/app/actions/purchase";
import { PurchaseStatusBadge } from "@/components/hotel/purchasing/PurchaseStatusBadge";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

/** Admin: every collective purchasing action (briefing §3.13). */
const PurchaseActionList = () => {
  const t = useTranslations("AdminPurchasing");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const { data, loading, error } = useApiData(adminListPurchaseActionsAction, undefined);
  const actions = data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/admin/purchasing/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("fields.title")}</th>
              <th className="px-5 py-3 font-semibold">{t("participants")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.deadline")}</th>
              <th className="px-5 py-3 font-semibold">{tc("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={4} loading={loading} error={error} empty={actions.length === 0} emptyText={t("empty")} />
            {!loading &&
              actions.map((a) => (
                <tr key={a._id} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/purchasing/${a._id}`} className="font-medium text-gray-900 hover:text-primary-dark">
                      {a.title}
                    </Link>
                    <span className="block text-xs text-gray-500">{a.category}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    {a.participants} / {a.targetParticipants}
                  </td>
                  <td className="px-5 py-3 text-gray-700">{format.dateTime(new Date(a.deadline), { dateStyle: "medium", timeZone: "UTC" })}</td>
                  <td className="px-5 py-3">
                    <PurchaseStatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseActionList;
