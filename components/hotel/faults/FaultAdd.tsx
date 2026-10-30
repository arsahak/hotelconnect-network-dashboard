"use client";

import { createFaultContactAction, type FaultContactInput } from "@/app/actions/faultContact";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import FaultForm from "./FaultForm";

/** "Add contact to the storingslijst" page (managers). */
const FaultAdd = () => {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: FaultContactInput) => {
    setSubmitting(true);
    const res = await createFaultContactAction(data);
    if (res.ok) {
      toast.success(t("created", { name: data.name }));
      router.push("/hotel/faults");
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/hotel/faults", label: t("back") }} />
      <FaultForm submitting={submitting} submitLabel={t("add")} cancelHref="/hotel/faults" onSubmit={handleSubmit} />
    </div>
  );
};

export default FaultAdd;
