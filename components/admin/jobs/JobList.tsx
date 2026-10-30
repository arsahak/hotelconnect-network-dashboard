"use client";

import { deleteVacancyAction, listVacanciesAction, type Vacancy } from "@/app/actions/vacancy";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { RowActions } from "@/components/shared/RowActions";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useHotelOptions } from "@/lib/useHotelOptions";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { JobStatusBadge } from "./JobStatusBadge";

const PAGE_SIZE = 20;
const STATUSES = ["pending", "published", "closed"] as const;

/** Jobs list page. ?hotel=<id> opens it filtered on one hotel. */
const JobList = () => {
  const t = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const hotels = useHotelOptions();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [hotel, setHotel] = useState(useSearchParams().get("hotel") ?? "");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, loading, error, reload } = useApiData(listVacanciesAction, { q, status, hotel, page, limit: PAGE_SIZE });
  const jobs = data?.items ?? [];

  const resetPage = (set: (v: string) => void) => (value: string) => {
    set(value);
    setPage(1);
  };

  const handleDelete = async (job: Vacancy) => {
    if (!window.confirm(t("confirmDelete", { title: job.title }))) return;
    const res = await deleteVacancyAction(job._id);
    if (res.ok) {
      toast.success(t("deleted", { title: job.title }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href={hotel ? `/admin/jobs/add?hotel=${hotel}` : "/admin/jobs/add"} className={primaryButtonClass}>
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
              id: "status",
              label: tc("status"),
              value: status,
              onChange: resetPage(setStatus),
              allLabel: tc("allStatuses"),
              options: STATUSES.map((s) => ({ value: s, label: t(`statuses.${s}`) })),
            },
          ]}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.job")}</th>
                <th className="px-5 py-3 font-semibold">{t("fields.hotel")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="hidden px-5 py-3 font-semibold xl:table-cell">{t("columns.published")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={loading} error={error} empty={jobs.length === 0} emptyText={q || status || hotel ? tc("noResults") : t("empty")} />
              {!loading &&
                jobs.map((job) => (
                  <tr key={job._id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/jobs/${job._id}`} className="block">
                        <span className="flex items-center gap-2 font-medium text-gray-900">
                          {job.title}
                          {job.urgent && <span className="rounded bg-ember-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ember-600">{t("fields.urgent")}</span>}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {optionLabel("vacancyCategories", job.category)} · {optionLabel("employmentTypes", job.employmentType)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {job.hotel?.name ?? "—"}
                      <span className="block text-xs text-gray-400">{job.city}</span>
                    </td>
                    <td className="px-5 py-3">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-gray-500 xl:table-cell">
                      {job.publishedAt ? format.dateTime(new Date(job.publishedAt), { dateStyle: "medium" }) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <RowActions viewHref={`/admin/jobs/${job._id}`} editHref={`/admin/jobs/edit?id=${job._id}`} onDelete={() => handleDelete(job)} />
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

export default JobList;
