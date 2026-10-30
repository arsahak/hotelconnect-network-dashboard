"use client";

import { createPermitAction, type PermitInput } from "@/app/actions/permit";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PermitForm, { EMPTY_PERMIT } from "./PermitForm";

/** "Add permit" page. ?type=… fills in the type (from a suggestion). */
const PermitAdd = () => {
  const t = useTranslations("Permits");
  const tc = useTranslations("Common");
  const router = useRouter();
  const type = useSearchParams().get("type") ?? "";
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PermitInput) => {
    setSubmitting(true);
    const res = await createPermitAction(data);
    if (res.ok && res.data) {
      toast.success(t("created"));
      router.push(`/hotel/permits/${res.data._id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} back={{ href: "/hotel/permits", label: t("back") }} />
      <PermitForm initial={{ ...EMPTY_PERMIT, type }} submitting={submitting} submitLabel={t("add")} cancelHref="/hotel/permits" onSubmit={handleSubmit} />
    </div>
  );
};

export default PermitAdd;
