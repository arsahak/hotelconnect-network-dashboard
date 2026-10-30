"use client";

import { createMyVacancyAction, uploadMyVacancyImageAction, type MyVacancyInput } from "@/app/actions/myVacancy";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HotelJobForm from "./HotelJobForm";

/** "New job" — /hotel/jobs/add. The job waits for HotelConnect before it goes live. */
const HotelJobAdd = () => {
  const t = useTranslations("HotelJobs");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: MyVacancyInput, image: File | null) => {
    setSubmitting(true);
    const res = await createMyVacancyAction(data);
    if (!res.ok || !res.data) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    if (image) {
      const form = new FormData();
      form.set("image", image);
      const up = await uploadMyVacancyImageAction(res.data._id, form);
      if (!up.ok) toast.error(up.error || tc("photoNotSaved"));
    }
    toast.success(t("created"));
    router.push(`/hotel/jobs/${res.data._id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/hotel/jobs", label: t("back") }} />
      <HotelJobForm submitting={submitting} submitLabel={t("submit")} cancelHref="/hotel/jobs" onSubmit={handleSubmit} />
    </div>
  );
};

export default HotelJobAdd;
