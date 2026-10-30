"use client";

import { updateMyHotelAction, type Facilities, type MyHotel } from "@/app/actions/myHotel";
import { Field } from "@/components/shared/form/Field";
import { Toggle } from "@/components/shared/form/Toggle";
import { inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { BiCheckShield } from "react-icons/bi";
import { saveSection, SectionForm } from "./SectionForm";

const FLAGS = ["restaurant", "lift", "pool", "parking"] as const;

/** Onboarding step 2 / My hotel: hotel type → compliance profile. */
export function FacilitiesSection({
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
  const tCompliance = useTranslations("Compliance");
  const [form, setForm] = useState<Facilities & { roomsText: string }>({
    ...hotel.facilities,
    roomsText: hotel.facilities.rooms?.toString() ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    const { roomsText, ...flags } = form;
    const saved = await saveSection(
      () => updateMyHotelAction({ facilities: { ...flags, rooms: roomsText === "" ? null : Number(roomsText) } }),
      { success: quiet ? undefined : t("saved"), error: tc("error") },
      toast,
    );
    setSubmitting(false);
    if (saved) onSaved(saved);
  };

  return (
    <SectionForm title={t("facilities.title")} description={t("facilities.description")} submitting={submitting} submitLabel={submitLabel} secondary={secondary} onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="facilities-rooms" label={t("facilities.rooms")}>
          <input id="facilities-rooms" type="number" min={0} max={5000} value={form.roomsText} onChange={(e) => setForm((f) => ({ ...f, roomsText: e.target.value }))} className={`${inputClass} max-w-40`} />
        </Field>
        <div className="hidden md:block" />
        {FLAGS.map((flag) => (
          <Toggle key={flag} checked={Boolean(form[flag])} onChange={(v) => setForm((f) => ({ ...f, [flag]: v }))} label={t(`facilities.${flag}`)} description={t(`facilities.${flag}Hint`)} />
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-moss-100 bg-moss-100/40 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-moss-600">
          <BiCheckShield size={18} /> {t("facilities.profileTitle")}
        </p>
        <p className="mt-1 text-xs text-gray-600">{t("facilities.profileHint")}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.compliance.permits.map((key) => (
            <span key={key} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-700 ring-1 ring-gray-200">
              {tCompliance(`permits.${key}`)}
            </span>
          ))}
        </div>
      </div>
    </SectionForm>
  );
}
