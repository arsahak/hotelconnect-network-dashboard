"use client";

import { deleteMyVoucherImageAction, getMyVoucherAction, updateMyVoucherAction, uploadMyVoucherImageAction, type MyVoucherInput } from "@/app/actions/myVoucher";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HotelVoucherForm, { hotelVoucherToInput } from "./HotelVoucherForm";

/** "Edit voucher" — /hotel/vouchers/edit?id=… */
const HotelVoucherEdit = () => {
  const t = useTranslations("HotelVouchers");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: voucher, loading, reload } = useApiData(getMyVoucherAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: MyVoucherInput, image: File | null) => {
    setSubmitting(true);
    const res = await updateMyVoucherAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    if (image) {
      const form = new FormData();
      form.set("image", image);
      const up = await uploadMyVoucherImageAction(id, form);
      if (!up.ok) toast.error(up.error || tc("photoNotSaved"));
    }
    toast.success(t("updated"));
    router.push(`/hotel/vouchers/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={voucher?.title} back={{ href: id ? `/hotel/vouchers/${id}` : "/hotel/vouchers", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : voucher ? (
        <HotelVoucherForm
          key={voucher.updatedAt}
          initial={hotelVoucherToInput(voucher)}
          currentImage={voucher.image || undefined}
          onRemoveImage={async () => {
            if (!window.confirm(tc("confirmRemovePhoto"))) return;
            const res = await deleteMyVoucherImageAction(id);
            if (res.ok) {
              toast.success(tc("photoRemoved"));
              reload();
            } else toast.error(res.error || tc("error"));
          }}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/hotel/vouchers/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default HotelVoucherEdit;
