"use client";

import { getFaultContactAction, updateFaultContactAction, type FaultContactInput } from "@/app/actions/faultContact";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import FaultForm, { faultContactToInput } from "./FaultForm";

/** "Edit contact" page — /faults/edit?id=… (managers). */
const FaultEdit = () => {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: contact, loading } = useApiData(getFaultContactAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: FaultContactInput) => {
    setSubmitting(true);
    const res = await updateFaultContactAction(id, data);
    if (res.ok) {
      toast.success(t("updated", { name: data.name }));
      router.push(`/hotel/faults/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={contact?.name} back={{ href: id ? `/hotel/faults/${id}` : "/hotel/faults", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : contact ? (
        <FaultForm initial={faultContactToInput(contact)} submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/hotel/faults/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default FaultEdit;
