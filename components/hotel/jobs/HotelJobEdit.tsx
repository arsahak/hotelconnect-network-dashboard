"use client";

import { deleteMyVacancyImageAction, getMyVacancyAction, updateMyVacancyAction, uploadMyVacancyImageAction, type MyVacancyInput } from "@/app/actions/myVacancy";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HotelJobForm, { hotelJobToInput } from "./HotelJobForm";

/** "Edit job" — /hotel/jobs/edit?id=… */
const HotelJobEdit = () => {
  const t = useTranslations("HotelJobs");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: job, loading, reload } = useApiData(getMyVacancyAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: MyVacancyInput, image: File | null) => {
    setSubmitting(true);
    const res = await updateMyVacancyAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    if (image) {
      const form = new FormData();
      form.set("image", image);
      const up = await uploadMyVacancyImageAction(id, form);
      if (!up.ok) toast.error(up.error || tc("photoNotSaved"));
    }
    toast.success(t("updated"));
    router.push(`/hotel/jobs/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={job?.title} back={{ href: id ? `/hotel/jobs/${id}` : "/hotel/jobs", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : job ? (
        <HotelJobForm
          key={job.updatedAt}
          initial={hotelJobToInput(job)}
          currentImage={job.image || undefined}
          onRemoveImage={async () => {
            if (!window.confirm(tc("confirmRemovePhoto"))) return;
            const res = await deleteMyVacancyImageAction(id);
            if (res.ok) {
              toast.success(tc("photoRemoved"));
              reload();
            } else toast.error(res.error || tc("error"));
          }}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/hotel/jobs/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default HotelJobEdit;
