"use client";

import { createPortalLinkAction, type PortalLinkInput } from "@/app/actions/portalLink";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import PortalLinkForm from "./PortalLinkForm";

/** "Add link" page — /hotel/links/add */
const PortalLinkAdd = () => {
  const t = useTranslations("PortalLinks");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PortalLinkInput) => {
    setSubmitting(true);
    const res = await createPortalLinkAction(data);
    if (res.ok) {
      toast.success(t("created"));
      router.push("/hotel/links");
    } else {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} back={{ href: "/hotel/links", label: t("back") }} />
      <PortalLinkForm submitting={submitting} submitLabel={t("add")} cancelHref="/hotel/links" onSubmit={handleSubmit} />
    </div>
  );
};

export default PortalLinkAdd;
