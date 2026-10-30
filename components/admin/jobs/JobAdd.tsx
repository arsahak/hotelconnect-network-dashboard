"use client";

import { createVacancyAction, type VacancyInput } from "@/app/actions/vacancy";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import JobForm, { EMPTY_JOB } from "./JobForm";

/** "Add job" page. ?hotel=<id> picks the hotel already. */
const JobAdd = () => {
  const t = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const router = useRouter();
  const hotel = useSearchParams().get("hotel") ?? "";
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: VacancyInput) => {
    setSubmitting(true);
    const res = await createVacancyAction(data);
    if (res.ok && res.data) {
      toast.success(t("created", { title: res.data.title }));
      router.push(`/admin/jobs/${res.data._id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/admin/jobs", label: t("back") }} />
      <JobForm initial={{ ...EMPTY_JOB, hotel }} submitting={submitting} submitLabel={t("add")} cancelHref="/admin/jobs" onSubmit={handleSubmit} />
    </div>
  );
};

export default JobAdd;
