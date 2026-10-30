"use client";

import { adminGetPurchaseActionAction, adminUpdatePurchaseActionAction, type PurchaseActionInput } from "@/app/actions/purchase";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PurchaseActionForm, { actionToInput } from "./PurchaseActionForm";

const PurchaseActionEdit = () => {
  const t = useTranslations("AdminPurchasing");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: action, loading } = useApiData(adminGetPurchaseActionAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PurchaseActionInput) => {
    setSubmitting(true);
    const res = await adminUpdatePurchaseActionAction(id, data);
    if (res.ok) {
      toast.success(t("updated"));
      router.push(`/admin/purchasing/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={action?.title} back={{ href: id ? `/admin/purchasing/${id}` : "/admin/purchasing", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : action ? (
        <PurchaseActionForm initial={actionToInput({ ...action, participants: action.participants.length })} submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/admin/purchasing/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default PurchaseActionEdit;
