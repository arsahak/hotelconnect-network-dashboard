"use client";

import { createSupplierAction, uploadSupplierPictureAction, type SupplierInput } from "@/app/actions/supplier";
import { PageHeader } from "@/components/shared/PageHeader";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import SupplierForm, { type SupplierPictures } from "./SupplierForm";

/** "Add supplier" page. The member number (L001…) is given by the API. */
const SupplierAdd = () => {
  const t = useTranslations("Suppliers");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: SupplierInput, pictures: SupplierPictures) => {
    setSubmitting(true);
    const res = await createSupplierAction(data);
    if (!res.ok || !res.data) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const supplier = res.data;
    for (const picture of ["logo", "image"] as const) {
      const error = await uploadAfterSave(pictures[picture], (fd) => uploadSupplierPictureAction(supplier._id, picture, fd));
      if (error) toast.error(`${tc("photoNotSaved")} ${error}`);
    }
    toast.success(t("created", { name: supplier.name, number: supplier.memberNumber }));
    router.push(`/admin/suppliers/${supplier._id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/admin/suppliers", label: t("back") }} />
      <SupplierForm submitting={submitting} submitLabel={t("add")} cancelHref="/admin/suppliers" onSubmit={handleSubmit} />
    </div>
  );
};

export default SupplierAdd;
