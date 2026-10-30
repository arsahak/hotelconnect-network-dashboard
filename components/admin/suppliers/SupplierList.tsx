"use client";

import { deleteSupplierAction, listSuppliersAction, type Supplier } from "@/app/actions/supplier";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { RowActions } from "@/components/shared/RowActions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCartAlt, BiPlus, BiStar } from "react-icons/bi";

const PAGE_SIZE = 20;

/** Suppliers list page: search, category and status filters, table, pages. */
const SupplierList = () => {
  const t = useTranslations("Suppliers");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, loading, error, reload } = useApiData(listSuppliersAction, { q, category, active, page, limit: PAGE_SIZE });
  const suppliers = data?.items ?? [];

  const resetPage = (set: (v: string) => void) => (value: string) => {
    set(value);
    setPage(1);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (!window.confirm(t("confirmDelete", { name: supplier.name }))) return;
    const res = await deleteSupplierAction(supplier._id);
    if (res.ok) {
      toast.success(t("deleted", { name: supplier.name }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/admin/suppliers/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />

      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar
          search={search}
          onSearch={resetPage(setSearch)}
          placeholder={t("searchPlaceholder")}
          onRefresh={reload}
          filters={[
            {
              id: "category",
              label: t("fields.categories"),
              value: category,
              onChange: resetPage(setCategory),
              allLabel: tc("allCategories"),
              options: (options?.supplierCategories ?? []).map((c) => ({ value: c, label: optionLabel("supplierCategories", c) })),
            },
            {
              id: "active",
              label: tc("status"),
              value: active,
              onChange: resetPage(setActive),
              allLabel: tc("allStatuses"),
              options: [
                { value: "true", label: tc("active") },
                { value: "false", label: tc("inactive") },
              ],
            },
          ]}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.supplier")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.categories")}</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">{t("columns.contact")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={suppliers.length === 0} emptyText={q || category || active ? tc("noResults") : t("empty")} />
              {!loading &&
                suppliers.map((supplier) => (
                  <tr key={supplier._id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/suppliers/${supplier._id}`} className="flex items-center gap-3">
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                          {supplier.logo ? (
                            <Thumb src={supplier.logo} alt="" fit="contain" className="p-1" />
                          ) : (
                            <span className="grid h-full w-full place-items-center font-display text-base text-brass-600">
                              {supplier.name.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-gray-900">{supplier.name}</span>
                          <span className="block text-xs text-gray-500">{supplier.memberNumber}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="max-w-60 px-5 py-3 text-xs text-gray-600">
                      {supplier.categories.map((c) => optionLabel("supplierCategories", c)).join(", ") || "—"}
                    </td>
                    <td className="hidden px-5 py-3 text-gray-600 lg:table-cell">
                      {supplier.contact.person || "—"}
                      <span className="block text-xs text-gray-400">{supplier.contact.email}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge tone={supplier.isActive ? "green" : "red"}>{supplier.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                        {supplier.featured && (
                          <span title={t("fields.featured")} className="text-brass-500">
                            <BiStar size={16} />
                          </span>
                        )}
                        {supplier.showInPurchasing && (
                          <span title={t("fields.showInPurchasing")} className="text-brass-500">
                            <BiCartAlt size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <RowActions
                        viewHref={`/admin/suppliers/${supplier._id}`}
                        editHref={`/admin/suppliers/edit?id=${supplier._id}`}
                        onDelete={() => handleDelete(supplier)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="border-t border-gray-200 p-4">
            <Pagination currentPage={data.page} totalPages={data.pages} onPageChange={setPage} totalItems={data.total} pageSize={PAGE_SIZE} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierList;
