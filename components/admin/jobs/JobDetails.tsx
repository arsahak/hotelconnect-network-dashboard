"use client";

import { deleteVacancyAction, getVacancyAction, updateVacancyAction, type VacancyStatus } from "@/app/actions/vacancy";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiBuildings, BiCalendar, BiCheckCircle, BiEnvelope, BiLinkExternal, BiLock, BiMap, BiPencil, BiPhone, BiTrash } from "react-icons/bi";
import { JobStatusBadge } from "./JobStatusBadge";

/** Job details page — /jobs/[id], with quick publish / close buttons. */
const JobDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: job, loading, reload } = useApiData(getVacancyAction, id);
  const [changing, setChanging] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }
  if (!job) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/jobs", label: t("back") }} />
      </div>
    );
  }

  const setStatus = async (status: VacancyStatus) => {
    setChanging(true);
    const res = await updateVacancyAction(job._id, { status });
    if (res.ok) {
      toast.success(t(`statusChanged.${status}`));
      reload();
    } else toast.error(res.error || tc("error"));
    setChanging(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { title: job.title }))) return;
    const res = await deleteVacancyAction(job._id);
    if (res.ok) {
      toast.success(t("deleted", { title: job.title }));
      router.push("/admin/jobs");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={job.title}
        description={`${job.hotel?.name ?? ""} · ${job.city}`}
        back={{ href: "/admin/jobs", label: t("back") }}
        actions={
          <>
            {job.status === "published" && (
              <a href={`${WEBSITE_URL}/jobs/${job.slug}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
                <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
              </a>
            )}
            <Link href={`/admin/jobs/edit?id=${job._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            <button type="button" onClick={handleDelete} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />
            {job.urgent && <span className="rounded bg-ember-100 px-2 py-0.5 text-xs font-semibold text-ember-600">{t("fields.urgent")}</span>}
          </div>
          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-gray-700">{job.description || "—"}</p>
          <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <InfoRow icon={<BiBuildings size={16} />} label={t("fields.hotel")} value={job.hotel && <Link href={`/admin/hotels/${job.hotel._id}`} className="underline underline-offset-2">{job.hotel.name}</Link>} />
            <InfoRow icon={<BiMap size={16} />} label={t("fields.location")} value={`${job.city}, ${optionLabel("regions", job.region)}`} />
            <InfoRow icon={<BiCheckCircle size={16} />} label={t("fields.category")} value={`${optionLabel("vacancyCategories", job.category)} · ${optionLabel("employmentTypes", job.employmentType)}`} />
            <InfoRow icon={<BiCalendar size={16} />} label={t("columns.published")} value={job.publishedAt ? format.dateTime(new Date(job.publishedAt), { dateStyle: "long" }) : "—"} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("sections.status")}</h2>
            <p className="mb-4 text-xs text-gray-500">{t(`statusHelp.${job.status}`)}</p>
            <div className="flex flex-col gap-2">
              {job.status !== "published" && (
                <button type="button" disabled={changing} onClick={() => setStatus("published")} className={primaryButtonClass}>
                  <BiCheckCircle size={16} /> {t("actions.publish")}
                </button>
              )}
              {job.status === "published" && (
                <button type="button" disabled={changing} onClick={() => setStatus("closed")} className={outlineButtonClass}>
                  <BiLock size={16} /> {t("actions.close")}
                </button>
              )}
            </div>
          </div>
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("sections.apply")}</h2>
            <div className="space-y-4">
              <InfoRow icon={<BiEnvelope size={16} />} label={t("fields.applyEmail")} value={job.applyEmail} />
              <InfoRow icon={<BiPhone size={16} />} label={t("fields.applyWhatsapp")} value={job.applyWhatsapp ? `+${job.applyWhatsapp}` : ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
