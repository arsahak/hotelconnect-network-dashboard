"use client";

import { createHotelAction, uploadHotelImageAction, type HotelInput } from "@/app/actions/hotel";
import { PageHeader } from "@/components/shared/PageHeader";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import HotelForm from "./HotelForm";

/** "Add hotel" page. The member number (H0001…) is given by the API. */
const HotelAdd = () => {
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: HotelInput, image: File | null) => {
    setSubmitting(true);
    const res = await createHotelAction(data);
    if (!res.ok || !res.data) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const hotel = res.data;
    const uploadError = await uploadAfterSave(image, (fd) => uploadHotelImageAction(hotel._id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("created", { name: hotel.name, number: hotel.memberNumber }));
    router.push(`/admin/hotels/${hotel._id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/admin/hotels", label: t("back") }} />
      <HotelForm submitting={submitting} submitLabel={t("add")} cancelHref="/admin/hotels" onSubmit={handleSubmit} />
    </div>
  );
};

export default HotelAdd;
