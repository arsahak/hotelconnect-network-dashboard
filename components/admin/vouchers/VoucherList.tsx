"use client";

import { deleteVoucherAction, listVouchersAction, type Voucher } from "@/app/actions/voucher";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { RowActions } from "@/components/shared/RowActions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useHotelOptions } from "@/lib/useHotelOptions";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";

const PAGE_SIZE = 20;

export function isPromoted(voucher: Pick<Voucher, "promotedUntil">) {
  return Boolean(voucher.promotedUntil && new Date(voucher.promotedUntil) > new Date());
}

/** Vouchers list page. ?hotel=<id> opens it filtered on one hotel. */
const VoucherList = () => {
  const t = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const hotels = useHotelOptions();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [hotel, setHotel] = useState(useSearchParams().get("hotel") ?? "");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, loading, error, reload } = useApiData(listVouchersAction, { q, category, hotel, page, limit: PAGE_SIZE });
  const vouchers = data?.items ?? [];

  const resetPage = (set: (v: string) => void) => (value: string) => {
    set(value);
    setPage(1);
  };

  const handleDelete = async (voucher: Voucher) => {
    if (!window.confirm(t("confirmDelete", { title: voucher.title }))) return;
    const res = await deleteVoucherAction(voucher._id);
    if (res.ok) {
      toast.success(t("deleted", { title: voucher.title }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href={hotel ? `/admin/vouchers/add?hotel=${hotel}` : "/admin/vouchers/add"} className={primaryButtonClass}>
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
              id: "hotel",
              label: t("fields.hotel"),
              value: hotel,
              onChange: resetPage(setHotel),
              allLabel: tc("allHotels"),
              options: hotels.map((h) => ({ value: h._id, label: h.name })),
            },
            {
              id: "category",
              label: t("fields.category"),
              value: category,
              onChange: resetPage(setCategory),
              allLabel: tc("allCategories"),
              options: (options?.voucherCategories ?? []).map((c) => ({ value: c, label: optionLabel("voucherCategories", c) })),
            },
          ]}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.voucher")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.hotel")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.discountPercent")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={vouchers.length === 0} emptyText={q || category || hotel ? tc("noResults") : t("empty")} />
              {!loading &&
                vouchers.map((voucher) => (
                  <tr key={voucher._id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/vouchers/${voucher._id}`} className="flex items-center gap-3">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Thumb src={voucher.image} alt="" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-gray-900">{voucher.title}</span>
                          <span className="block text-xs text-gray-500">{optionLabel("voucherCategories", voucher.category)}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{voucher.hotel?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-semibold text-primary-dark">{voucher.discountPercent}%</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge tone={voucher.isActive ? "green" : "red"}>{voucher.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                        {isPromoted(voucher) && (
                          <span className="text-[11px] text-brass-600">
                            {t("promotedUntil", { date: format.dateTime(new Date(voucher.promotedUntil!), { dateStyle: "medium" }) })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <RowActions viewHref={`/admin/vouchers/${voucher._id}`} editHref={`/admin/vouchers/edit?id=${voucher._id}`} onDelete={() => handleDelete(voucher)} />
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

export default VoucherList;
