"use client";

import { getPortalLinkAction, updatePortalLinkAction, type PortalLinkInput } from "@/app/actions/portalLink";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PortalLinkForm, { portalLinkToInput } from "./PortalLinkForm";

/** "Edit link" page — /hotel/links/edit?id=… */
const PortalLinkEdit = () => {
  const t = useTranslations("PortalLinks");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: link, loading } = useApiData(getPortalLinkAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PortalLinkInput) => {
    setSubmitting(true);
    const res = await updatePortalLinkAction(id, data);
    if (res.ok) {
      toast.success(t("updated"));
      router.push(`/hotel/links/${id}`);
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={link?.name} back={{ href: id ? `/hotel/links/${id}` : "/hotel/links", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : link ? (
        <PortalLinkForm initial={portalLinkToInput(link)} submitting={submitting} submitLabel={tc("saveChanges")} cancelHref={`/hotel/links/${id}`} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default PortalLinkEdit;
