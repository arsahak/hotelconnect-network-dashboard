"use client";

import { getVacancyAction, updateVacancyAction, type VacancyInput } from "@/app/actions/vacancy";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import JobForm, { EMPTY_JOB } from "./JobForm";

/** "Edit job" page — /jobs/edit?id=… */
const JobEdit = () => {
  const t = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: job, loading } = useApiData(getVacancyAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: VacancyInput) => {
    setSubmitting(true);
    const res = await updateVacancyAction(id, data);
    if (res.ok) {
      toast.success(t("updated", { title: data.title }));
      router.push(`/admin/jobs/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={job?.title} back={{ href: id ? `/admin/jobs/${id}` : "/admin/jobs", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : job ? (
        <JobForm
          initial={{ ...EMPTY_JOB, ...job, hotel: job.hotel?._id ?? "", applyWhatsapp: job.applyWhatsapp ?? "" }}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/admin/jobs/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default JobEdit;
