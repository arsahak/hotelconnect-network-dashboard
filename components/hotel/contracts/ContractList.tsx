"use client";

import { deleteContractAction, listContractsAction, type Contract } from "@/app/actions/contract";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { RowActions } from "@/components/shared/RowActions";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiFile, BiPlus, BiRefresh, BiWallet } from "react-icons/bi";

export const contractTitle = (c: Pick<Contract, "contractFor" | "company">) => c.contractFor || c.company;

/** Contract register: totals for budgeting, then every contract by end date. */
const ContractList = () => {
  const t = useTranslations("Contracts");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const [search, setSearch] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useApiData(listContractsAction, { q });
  const contracts = data?.items ?? [];
  const euro = (value: number) => format.number(value, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const handleDelete = async (contract: Contract) => {
    if (!window.confirm(t("confirmDelete", { name: contractTitle(contract) }))) return;
    const res = await deleteContractAction(contract._id);
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
          <Link href="/hotel/contracts/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`${cardClass} flex items-center gap-4`}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brass-100 text-brass-600">
            <BiFile size={22} />
          </span>
          <div>
            <p className="text-xs text-gray-500">{t("totals.count")}</p>
            <p className="font-display text-3xl text-gray-950">{data?.totals.count ?? "–"}</p>
          </div>
        </div>
        {data?.totals.costPerYear !== null && data?.totals.costPerYear !== undefined && (
          <div className={`${cardClass} flex items-center gap-4`}>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-moss-100 text-moss-600">
              <BiWallet size={22} />
            </span>
            <div>
              <p className="text-xs text-gray-500">{t("totals.costPerYear")}</p>
              <p className="font-display text-3xl text-gray-950">{euro(data.totals.costPerYear)}</p>
              <p className="text-xs text-gray-400">{t("totals.withCost", { count: data.totals.withCost, total: data.totals.count })}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar search={search} onSearch={setSearch} placeholder={t("searchPlaceholder")} onRefresh={reload} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.contract")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.endDate")}</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">{t("columns.cancelBy")}</th>
                <th className="hidden px-5 py-3 font-semibold md:table-cell">{t("fields.costPerYear")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={contracts.length === 0} emptyText={q ? tc("noResults") : t("empty")} />
              {!loading &&
                contracts.map((contract) => (
                  <tr key={contract._id} className="align-top transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/hotel/contracts/${contract._id}`} className="block">
                        <span className="block font-medium text-gray-900">{contractTitle(contract)}</span>
                        <span className="block text-xs text-gray-500">
                          {contract.contractFor && contract.company ? contract.company : ""}
                          {contract.autoRenew && (
                            <span className="ml-1 inline-flex items-center gap-0.5 text-brass-600">
                              <BiRefresh size={12} /> {t("autoRenewShort")}
                            </span>
                          )}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <DateBadge value={contract.endDate} />
                    </td>
                    <td className="hidden px-5 py-3 lg:table-cell">
                      <DateBadge value={contract.noticeDeadline} />
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-gray-700 md:table-cell">
                      {contract.costPerYear !== null ? euro(contract.costPerYear) : "—"}
                      {contract.ledgerAccount && <span className="block text-xs text-gray-400">{contract.ledgerAccount}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <RowActions viewHref={`/hotel/contracts/${contract._id}`} editHref={`/hotel/contracts/edit?id=${contract._id}`} onDelete={() => handleDelete(contract)} />
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

export default ContractList;
