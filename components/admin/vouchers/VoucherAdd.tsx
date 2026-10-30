"use client";

import { createVoucherAction, uploadVoucherImageAction, type VoucherInput } from "@/app/actions/voucher";
import { PageHeader } from "@/components/shared/PageHeader";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import VoucherForm, { EMPTY_VOUCHER } from "./VoucherForm";

/** "Add voucher" page. ?hotel=<id> picks the hotel already. */
const VoucherAdd = () => {
  const t = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const router = useRouter();
  const hotel = useSearchParams().get("hotel") ?? "";
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: VoucherInput, image: File | null) => {
    setSubmitting(true);
    const res = await createVoucherAction(data);
    if (!res.ok || !res.data) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const voucher = res.data;
    const uploadError = await uploadAfterSave(image, (fd) => uploadVoucherImageAction(voucher._id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("created", { title: voucher.title }));
    router.push(`/admin/vouchers/${voucher._id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/admin/vouchers", label: t("back") }} />
      <VoucherForm initial={{ ...EMPTY_VOUCHER, hotel }} submitting={submitting} submitLabel={t("add")} cancelHref="/admin/vouchers" onSubmit={handleSubmit} />
    </div>
  );
};

export default VoucherAdd;
