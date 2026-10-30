"use client";

import { getPermitAction, updatePermitAction, type PermitInput } from "@/app/actions/permit";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PermitForm, { permitToInput } from "./PermitForm";

/** "Edit permit" page — /permits/edit?id=… */
const PermitEdit = () => {
  const t = useTranslations("Permits");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: permit, loading } = useApiData(getPermitAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PermitInput) => {
    setSubmitting(true);
    const res = await updatePermitAction(id, data);
    if (res.ok) {
      toast.success(t("updated"));
      router.push(`/hotel/permits/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={permit?.type} back={{ href: id ? `/hotel/permits/${id}` : "/hotel/permits", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : permit ? (
        <PermitForm initial={permitToInput(permit)} submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/hotel/permits/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default PermitEdit;
