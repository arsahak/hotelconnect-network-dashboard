"use client";

import { deletePermitAction, listPermitsAction, type Permit } from "@/app/actions/permit";
import { DateBadge } from "@/components/shared/DateBadge";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { RowActions } from "@/components/shared/RowActions";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLinkExternal, BiPlus } from "react-icons/bi";
import { PermitSuggestions } from "./PermitSuggestions";

/** Permits and certificates: suggestions for this hotel, then the list by expiry date. */
const PermitList = () => {
  const t = useTranslations("Permits");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useApiData(listPermitsAction, { q });
  const permits = data?.items ?? [];

  const handleDelete = async (permit: Permit) => {
    if (!window.confirm(t("confirmDelete", { name: permit.type }))) return;
    const res = await deletePermitAction(permit._id);
    if (res.ok) {
      toast.success(t("deleted"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/hotel/permits/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />

      {data && !q && (
        <PermitSuggestions
          suggestions={data.suggestions}
          existing={permits.map((p) => p.type)}
          onPick={(label) => router.push(`/hotel/permits/add?type=${encodeURIComponent(label)}`)}
        />
      )}

      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar search={search} onSearch={setSearch} placeholder={t("searchPlaceholder")} onRefresh={reload} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("fields.type")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.expiryDate")}</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">{t("fields.documentLink")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={4} loading={loading} error={error} empty={permits.length === 0} emptyText={q ? tc("noResults") : t("empty")} />
              {!loading &&
                permits.map((permit) => (
                  <tr key={permit._id} className="align-top transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/hotel/permits/${permit._id}`} className="block">
                        <span className="block font-medium text-gray-900">{permit.type}</span>
                        <span className="block text-xs text-gray-500">{permit.authority}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <DateBadge value={permit.expiryDate} />
                    </td>
                    <td className="hidden px-5 py-3 md:table-cell">
                      {permit.documentLink ? (
                        <a href={permit.documentLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-dark hover:underline">
                          <BiLinkExternal size={14} /> {t("openDocument")}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <RowActions viewHref={`/hotel/permits/${permit._id}`} editHref={`/hotel/permits/edit?id=${permit._id}`} onDelete={() => handleDelete(permit)} />
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

export default PermitList;
