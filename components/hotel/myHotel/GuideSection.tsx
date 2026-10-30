"use client";

import { deleteMyHotelImageAction, updateMyHotelAction, uploadMyHotelImageAction, type MyHotel } from "@/app/actions/myHotel";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { saveSection, SectionForm } from "./SectionForm";

/**
 * Onboarding step 6 / My hotel: the hotel-guide profile on the website.
 * Briefing §2.3: changes appear right away, without approval.
 */
export function GuideSection({
  hotel,
  onSaved,
  submitLabel,
  secondary,
  quiet,
}: {
  hotel: MyHotel;
  onSaved: (hotel: MyHotel) => void;
  submitLabel?: string;
  secondary?: ReactNode;
  quiet?: boolean;
}) {
  const t = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const [form, setForm] = useState({ description: hotel.description, bookingUrl: hotel.bookingUrl, offer: hotel.offer });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(hotel.image);
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setSubmitting(true);
    let saved = await saveSection(() => updateMyHotelAction(form), { error: tc("error") }, toast);
    if (saved && image) {
      const formData = new FormData();
      formData.set("image", image);
      const upload = await uploadMyHotelImageAction(formData);
      if (upload.ok && upload.data) {
        saved = { ...saved, image: upload.data.image };
        setImage(null);
      } else toast.error(`${tc("photoNotSaved")} ${upload.error ?? ""}`);
    }
    setSubmitting(false);
    if (saved) {
      setCurrentImage(saved.image);
      if (!quiet) toast.success(t("saved"));
      onSaved(saved);
    }
  };

  const removeImage = async () => {
    if (!window.confirm(tc("confirmRemovePhoto"))) return;
    const res = await deleteMyHotelImageAction();
    if (res.ok) {
      setCurrentImage("");
      toast.success(tc("photoRemoved"));
    } else toast.error(res.error || tc("error"));
  };

  return (
    <SectionForm title={t("guide.title")} description={t("guide.description")} submitting={submitting} submitLabel={submitLabel} secondary={secondary} onSubmit={submit}>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={removeImage} />
        <div className="grid gap-4">
          <Field id="guide-description" label={t("guide.text")} hint={t("guide.textHint", { count: form.description.length })}>
            <textarea id="guide-description" rows={4} maxLength={1000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
          <Field id="guide-booking" label={t("guide.bookingUrl")} hint={t("guide.bookingUrlHint")}>
            <input id="guide-booking" type="url" value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="guide-offer" label={t("guide.offer")} hint={t("guide.offerHint")}>
            <input id="guide-offer" maxLength={60} value={form.offer} onChange={(e) => set("offer", e.target.value)} placeholder="15% off midweek" className={inputClass} />
          </Field>
        </div>
      </div>
    </SectionForm>
  );
}
