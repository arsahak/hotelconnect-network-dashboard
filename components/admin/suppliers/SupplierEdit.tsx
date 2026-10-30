"use client";

import {
  deleteSupplierPictureAction,
  getSupplierAction,
  updateSupplierAction,
  uploadSupplierPictureAction,
  type SupplierInput,
  type SupplierPicture,
} from "@/app/actions/supplier";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import SupplierForm, { EMPTY_SUPPLIER, type SupplierPictures } from "./SupplierForm";

/** "Edit supplier" page — /suppliers/edit?id=… */
const SupplierEdit = () => {
  const t = useTranslations("Suppliers");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: supplier, loading, setData } = useApiData(getSupplierAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: SupplierInput, pictures: SupplierPictures) => {
    setSubmitting(true);
    const res = await updateSupplierAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    for (const picture of ["logo", "image"] as const) {
      const error = await uploadAfterSave(pictures[picture], (fd) => uploadSupplierPictureAction(id, picture, fd));
      if (error) toast.error(`${tc("photoNotSaved")} ${error}`);
    }
    toast.success(t("updated", { name: data.name }));
    router.push(`/admin/suppliers/${id}`);
  };

  const removePicture = async (picture: SupplierPicture) => {
    if (!supplier || !window.confirm(tc("confirmRemovePhoto"))) return;
    const res = await deleteSupplierPictureAction(id, picture);
    if (res.ok) {
      setData({ ...supplier, [picture]: "" });
      toast.success(tc("photoRemoved"));
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("editTitle")}
        description={supplier ? `${supplier.name} · ${supplier.memberNumber}` : undefined}
        back={{ href: id ? `/admin/suppliers/${id}` : "/admin/suppliers", label: t("back") }}
      />
      {loading ? (
        <FormSkeleton />
      ) : supplier ? (
        <SupplierForm
          initial={{ ...EMPTY_SUPPLIER, ...supplier, contact: { ...EMPTY_SUPPLIER.contact, ...supplier.contact } }}
          current={{ logo: supplier.logo, image: supplier.image }}
          onRemovePicture={removePicture}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/admin/suppliers/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default SupplierEdit;
