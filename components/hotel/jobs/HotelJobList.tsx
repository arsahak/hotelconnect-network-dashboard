"use client";

import { deleteMyVacancyAction, listMyVacanciesAction, type MyVacancy } from "@/app/actions/myVacancy";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { RowActions } from "@/components/shared/RowActions";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { HotelJobStatusBadge } from "./HotelJobStatusBadge";

/** The hotel's own jobs (briefing §3.7): status and how many applications came in. */
const HotelJobList = () => {
  const t = useTranslations("HotelJobs");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const { data, loading, error, reload } = useApiData(listMyVacanciesAction, undefined);
  const jobs = data ?? [];

  const remove = async (job: MyVacancy) => {
    if (!window.confirm(t("confirmDelete", { title: job.title }))) return;
    const res = await deleteMyVacancyAction(job._id);
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
          <Link href="/hotel/jobs/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("columns.job")}</th>
              <th className="px-5 py-3 font-semibold">{tc("status")}</th>
              <th className="px-5 py-3 font-semibold">{t("columns.applications")}</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">{tc("added")}</th>
              <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={5} loading={loading} error={error} empty={jobs.length === 0} emptyText={t("empty")} />
            {!loading &&
              jobs.map((job) => (
                <tr key={job._id} className="align-top transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/hotel/jobs/${job._id}`} className="block">
                      <span className="block font-medium text-gray-900 hover:text-primary-dark">{job.title}</span>
                      <span className="block text-xs text-gray-500">
                        {optionLabel("vacancyCategories", job.category)} · {optionLabel("employmentTypes", job.employmentType)} · {t(`style.${job.style ?? "traditional"}`)}
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <HotelJobStatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-700">{job.applicationCount ?? 0}</td>
                  <td className="hidden px-5 py-3 text-gray-500 md:table-cell">{format.dateTime(new Date(job.createdAt), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-3">
                    <RowActions viewHref={`/hotel/jobs/${job._id}`} editHref={`/hotel/jobs/edit?id=${job._id}`} onDelete={() => remove(job)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelJobList;
