"use client";

import { listTendersAction } from "@/app/actions/tender";
import { DateBadge } from "@/components/shared/DateBadge";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { TenderStatusBadge } from "./TenderStatusBadge";

/** The hotel's tenders: status, deadline and how many quotes came in (briefing §3.5). */
const TenderList = () => {
  const t = useTranslations("Tenders");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const [search, setSearch] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useApiData(listTendersAction, { q });
  const tenders = data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/hotel/tenders/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />
      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar search={search} onSearch={setSearch} placeholder={t("searchPlaceholder")} onRefresh={reload} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("fields.title")}</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">{t("fields.category")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.deadline")}</th>
                <th className="px-5 py-3 font-semibold">{t("quotes")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={tenders.length === 0} emptyText={q ? tc("noResults") : t("empty")} />
              {!loading &&
                tenders.map((tender) => (
                  <tr key={tender._id} className="align-top transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/hotel/tenders/${tender._id}`} className="block">
                        <span className="block font-medium text-gray-900 hover:text-primary-dark">{tender.title}</span>
                        <span className="block text-xs text-gray-500">{optionLabel("tenderTypes", tender.type)}</span>
                      </Link>
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      <span className="block text-gray-700">{optionLabel("supplierCategories", tender.category)}</span>
                      <span className="block text-xs text-gray-500">{optionLabel("regions", tender.region)}</span>
                    </td>
                    <td className="px-5 py-3">{tender.status === "open" ? <DateBadge value={tender.deadline} /> : <span className="text-gray-500">—</span>}</td>
                    <td className="px-5 py-3 text-gray-700">{t("quotesOf", { offers: tender.offerCount, invited: tender.invitedCount })}</td>
                    <td className="px-5 py-3">
                      <TenderStatusBadge status={tender.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenderList;
