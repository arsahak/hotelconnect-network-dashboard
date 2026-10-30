"use client";

import { deleteMyVacancyAction, getMyVacancyAction, updateMyVacancyAction } from "@/app/actions/myVacancy";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiCategory, BiEnvelope, BiLinkExternal, BiLockAlt, BiLockOpenAlt, BiPencil, BiPhone, BiTrash, BiVideo } from "react-icons/bi";
import { HotelJobStatusBadge } from "./HotelJobStatusBadge";

/** One job — /hotel/jobs/[id]: status, applications and close/reopen. */
const HotelJobDetails = ({ id }: { id: string }) => {
  const t = useTranslations("HotelJobs");
  const tj = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: job, loading, reload } = useApiData(getMyVacancyAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!job) return <PageHeader title={t("notFound")} back={{ href: "/hotel/jobs", label: t("back") }} />;

  const setStatus = async (status: "closed" | "pending") => {
    if (status === "closed" && !window.confirm(t("confirmClose"))) return;
    const res = await updateMyVacancyAction(job._id, { status });
    if (res.ok) {
      toast.success(status === "closed" ? t("closed") : t("reopened"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  const remove = async () => {
    if (!window.confirm(t("confirmDelete", { title: job.title }))) return;
    const res = await deleteMyVacancyAction(job._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/jobs");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={job.title}
        description={`${optionLabel("vacancyCategories", job.category)} · ${optionLabel("employmentTypes", job.employmentType)}`}
        back={{ href: "/hotel/jobs", label: t("back") }}
        actions={
          <>
            {job.status === "published" && (
              <a href={`${WEBSITE_URL}/jobs/${job.slug}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
                <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
              </a>
            )}
            <Link href={`/hotel/jobs/edit?id=${job._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            {job.status === "closed" ? (
              <button type="button" onClick={() => setStatus("pending")} className={outlineButtonClass}>
                <BiLockOpenAlt size={16} /> {t("reopen")}
              </button>
            ) : (
              <button type="button" onClick={() => setStatus("closed")} className={outlineButtonClass}>
                <BiLockAlt size={16} /> {t("close")}
              </button>
            )}
            <button type="button" onClick={remove} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <HotelJobStatusBadge status={job.status} />
            <span className="text-xs text-gray-500">{t(`statusHint.${job.status}`)}</span>
          </div>
          {job.style === "visual" && job.image && (
            <div className="relative mb-5 aspect-[21/9] overflow-hidden rounded-lg bg-gray-50">
              <Thumb src={job.image} alt="" />
            </div>
          )}
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{job.description || "—"}</p>
          <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <InfoRow icon={<BiCategory size={16} />} label={t("style.title")} value={t(`style.${job.style ?? "traditional"}`)} />
            {job.style === "visual" && (
              <InfoRow icon={<BiVideo size={16} />} label={t("fields.video")} value={job.videoUrl && <a href={job.videoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{job.videoUrl}</a>} />
            )}
            <InfoRow icon={<BiEnvelope size={16} />} label={tj("fields.applyEmail")} value={job.applyEmail} />
            <InfoRow icon={<BiPhone size={16} />} label={tj("fields.applyWhatsapp")} value={job.applyWhatsapp ? `+${job.applyWhatsapp}` : ""} />
          </div>
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("columns.applications")}</h2>
          <p className="font-display text-5xl text-gray-950">{job.applicationCount ?? 0}</p>
          <p className="mt-2 text-sm text-gray-600">
            {job.lastApplicationAt ? t("lastApplication", { date: format.dateTime(new Date(job.lastApplicationAt), { dateStyle: "medium" }) }) : t("noApplications")}
          </p>
          <p className="mt-4 text-xs text-gray-500">{t("applicationsHint", { email: job.applyEmail })}</p>
        </div>
      </div>
    </div>
  );
};

export default HotelJobDetails;
