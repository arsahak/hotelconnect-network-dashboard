"use client";

import { getTenderAction, updateTenderAction, type TenderInput } from "@/app/actions/tender";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TenderForm, { tenderToInput } from "./TenderForm";

/** "Edit tender" page — /hotel/tenders/edit?id=… (only while open). */
const TenderEdit = () => {
  const t = useTranslations("Tenders");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: tender, loading } = useApiData(getTenderAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({ title, description, deadline, budget }: TenderInput) => {
    setSubmitting(true);
    const res = await updateTenderAction(id, { title, description, deadline, budget });
    if (res.ok) {
      toast.success(t("updated"));
      router.push(`/hotel/tenders/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={tender?.title} back={{ href: id ? `/hotel/tenders/${id}` : "/hotel/tenders", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : tender && tender.status === "open" ? (
        <TenderForm initial={tenderToInput(tender)} editing submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/hotel/tenders/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{tender ? t("closedCannotEdit") : t("notFound")}</div>
      )}
    </div>
  );
};

export default TenderEdit;
