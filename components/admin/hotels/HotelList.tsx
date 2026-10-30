"use client";

import { deleteHotelAction, listHotelsAction, type Hotel } from "@/app/actions/hotel";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus, BiStar } from "react-icons/bi";
import { RowActions } from "@/components/shared/RowActions";

const PAGE_SIZE = 20;

/** Hotels list page: search, region and status filters, table, pages. */
const HotelList = () => {
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const options = useOptions();
  const optionLabel = useOptionLabel();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, loading, error, reload } = useApiData(listHotelsAction, { q, region, active, page, limit: PAGE_SIZE });
  const hotels = data?.items ?? [];

  const resetPage = <T,>(set: (v: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };

  const handleDelete = async (hotel: Hotel) => {
    if (!window.confirm(t("confirmDelete", { name: hotel.name }))) return;
    const res = await deleteHotelAction(hotel._id);
    if (res.ok) {
      toast.success(t("deleted", { name: hotel.name }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/admin/hotels/add" className={primaryButtonClass}>
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
              id: "region",
              label: t("fields.region"),
              value: region,
              onChange: resetPage(setRegion),
              allLabel: tc("allRegions"),
              options: (options?.regions ?? []).map((r) => ({ value: r, label: optionLabel("regions", r) })),
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
                <th className="px-5 py-3 font-semibold">{t("columns.hotel")}</th>
                <th className="px-5 py-3 font-semibold">{t("columns.location")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="hidden px-5 py-3 font-semibold xl:table-cell">{tc("added")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={hotels.length === 0} emptyText={q || region || active ? tc("noResults") : t("empty")} />
              {!loading &&
                hotels.map((hotel) => (
                  <tr key={hotel._id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/hotels/${hotel._id}`} className="flex items-center gap-3">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Thumb src={hotel.image} alt="" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-gray-900">{hotel.name}</span>
                          <span className="block text-xs text-gray-500">{hotel.memberNumber}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {hotel.city}
                      <span className="block text-xs text-gray-400">{optionLabel("regions", hotel.region)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge tone={hotel.isActive ? "green" : "red"}>{hotel.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                        {hotel.featured && (
                          <span title={t("fields.featured")} className="text-brass-500">
                            <BiStar size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-gray-500 xl:table-cell">
                      {format.dateTime(new Date(hotel.createdAt), { dateStyle: "medium" })}
                    </td>
                    <td className="px-5 py-3">
                      <RowActions
                        viewHref={`/admin/hotels/${hotel._id}`}
                        editHref={`/admin/hotels/edit?id=${hotel._id}`}
                        onDelete={() => handleDelete(hotel)}
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

export default HotelList;
