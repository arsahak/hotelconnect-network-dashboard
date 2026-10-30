"use client";

import { getContractAction, updateContractAction, type ContractInput } from "@/app/actions/contract";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ContractForm, { contractToInput } from "./ContractForm";
import { contractTitle } from "./ContractList";

/** "Edit contract" page — /contracts/edit?id=… */
const ContractEdit = () => {
  const t = useTranslations("Contracts");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: contract, loading } = useApiData(getContractAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ContractInput) => {
    setSubmitting(true);
    const res = await updateContractAction(id, data);
    if (res.ok) {
      toast.success(t("updated"));
      router.push(`/hotel/contracts/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={contract ? contractTitle(contract) : undefined} back={{ href: id ? `/hotel/contracts/${id}` : "/hotel/contracts", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : contract ? (
        <ContractForm initial={contractToInput(contract)} submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/hotel/contracts/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default ContractEdit;
