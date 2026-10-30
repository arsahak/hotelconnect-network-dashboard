"use client";

import { adminCreatePurchaseActionAction, type PurchaseActionInput } from "@/app/actions/purchase";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PurchaseActionForm from "./PurchaseActionForm";

const PurchaseActionAdd = () => {
  const t = useTranslations("AdminPurchasing");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PurchaseActionInput) => {
    setSubmitting(true);
    const res = await adminCreatePurchaseActionAction(data);
    if (res.ok && res.data) {
      toast.success(t("created"));
      router.push(`/admin/purchasing/${res.data._id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} back={{ href: "/admin/purchasing", label: t("back") }} />
      <PurchaseActionForm submitting={submitting} submitLabel={t("add")} cancelHref="/admin/purchasing" onSubmit={handleSubmit} />
    </div>
  );
};

export default PurchaseActionAdd;
