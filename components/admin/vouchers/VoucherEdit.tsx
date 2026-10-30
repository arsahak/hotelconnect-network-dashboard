"use client";

import { deleteVoucherImageAction, getVoucherAction, updateVoucherAction, uploadVoucherImageAction, type VoucherInput } from "@/app/actions/voucher";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import VoucherForm, { EMPTY_VOUCHER } from "./VoucherForm";

/** "Edit voucher" page — /vouchers/edit?id=… */
const VoucherEdit = () => {
  const t = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: voucher, loading, setData } = useApiData(getVoucherAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: VoucherInput, image: File | null) => {
    setSubmitting(true);
    const res = await updateVoucherAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const uploadError = await uploadAfterSave(image, (fd) => uploadVoucherImageAction(id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("updated", { title: data.title }));
    router.push(`/admin/vouchers/${id}`);
  };

  const removeImage = async () => {
    if (!voucher || !window.confirm(tc("confirmRemovePhoto"))) return;
    const res = await deleteVoucherImageAction(id);
    if (res.ok) {
      setData({ ...voucher, image: "" });
      toast.success(tc("photoRemoved"));
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={voucher?.title} back={{ href: id ? `/admin/vouchers/${id}` : "/admin/vouchers", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : voucher ? (
        <VoucherForm
          initial={{
            ...EMPTY_VOUCHER,
            ...voucher,
            hotel: voucher.hotel?._id ?? "",
            promotedUntil: voucher.promotedUntil ? voucher.promotedUntil.slice(0, 10) : "",
          }}
          currentImage={voucher.image}
          onRemoveImage={removeImage}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/admin/vouchers/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default VoucherEdit;
