"use client";

import { deleteHotelImageAction, getHotelAction, updateHotelAction, uploadHotelImageAction, type HotelInput } from "@/app/actions/hotel";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HotelForm, { EMPTY_HOTEL } from "./HotelForm";

/** "Edit hotel" page — /hotels/edit?id=… */
const HotelEdit = () => {
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: hotel, loading, setData } = useApiData(getHotelAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: HotelInput, image: File | null) => {
    setSubmitting(true);
    const res = await updateHotelAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const uploadError = await uploadAfterSave(image, (fd) => uploadHotelImageAction(id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("updated", { name: data.name }));
    router.push(`/admin/hotels/${id}`);
  };

  const removeImage = async () => {
    if (!hotel || !window.confirm(tc("confirmRemovePhoto"))) return;
    const res = await deleteHotelImageAction(id);
    if (res.ok && res.data) {
      setData({ ...hotel, image: "" });
      toast.success(tc("photoRemoved"));
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("editTitle")}
        description={hotel ? `${hotel.name} · ${hotel.memberNumber}` : undefined}
        back={{ href: id ? `/admin/hotels/${id}` : "/admin/hotels", label: t("back") }}
      />
      {loading ? (
        <FormSkeleton />
      ) : hotel ? (
        <HotelForm
          initial={{
            ...EMPTY_HOTEL,
            ...hotel,
            emails: { ...EMPTY_HOTEL.emails, ...hotel.emails },
          }}
          currentImage={hotel.image}
          onRemoveImage={removeImage}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/admin/hotels/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default HotelEdit;
