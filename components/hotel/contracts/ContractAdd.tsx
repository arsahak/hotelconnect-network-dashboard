"use client";

import { createContractAction, type ContractInput } from "@/app/actions/contract";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ContractForm from "./ContractForm";

/** "Add contract" page. */
const ContractAdd = () => {
  const t = useTranslations("Contracts");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ContractInput) => {
    setSubmitting(true);
    const res = await createContractAction(data);
    if (res.ok && res.data) {
      toast.success(t("created"));
      router.push(`/hotel/contracts/${res.data._id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} back={{ href: "/hotel/contracts", label: t("back") }} />
      <ContractForm submitting={submitting} submitLabel={t("add")} cancelHref="/hotel/contracts" onSubmit={handleSubmit} />
    </div>
  );
};

export default ContractAdd;
