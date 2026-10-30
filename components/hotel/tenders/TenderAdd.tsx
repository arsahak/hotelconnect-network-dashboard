"use client";

import { createTenderAction, type TenderInput } from "@/app/actions/tender";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TenderForm from "./TenderForm";

/** "New tender" page — /hotel/tenders/add */
const TenderAdd = () => {
  const t = useTranslations("Tenders");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: TenderInput) => {
    setSubmitting(true);
    const res = await createTenderAction(data);
    if (res.ok && res.data) {
      if (res.data.invitedCount > 0) toast.success(t("sent", { count: res.data.invitedCount }));
      else toast(t("sentNoSupplier"), { icon: "ℹ️" });
      router.push(`/hotel/tenders/${res.data._id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} back={{ href: "/hotel/tenders", label: t("back") }} />
      <TenderForm submitting={submitting} submitLabel={t("send")} cancelHref="/hotel/tenders" onSubmit={handleSubmit} />
    </div>
  );
};

export default TenderAdd;
