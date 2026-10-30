"use client";

import { completeOnboardingAction, getCalendarAction, type MyHotel } from "@/app/actions/myHotel";
import { cardClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { BiCheckCircle, BiPencil } from "react-icons/bi";

function Block({ step, title, children, goTo, editLabel }: { step: number; title: string; children: ReactNode; goTo: (step: number) => void; editLabel: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button type="button" onClick={() => goTo(step)} className="inline-flex items-center gap-1 text-xs text-primary-dark hover:underline">
          <BiPencil size={13} /> {editLabel}
        </button>
      </div>
      <div className="space-y-1 text-sm text-gray-600">{children}</div>
    </div>
  );
}

/** Step 8: an overview of everything, then "Confirm" opens the dashboard. */
export function ConfirmStep({ hotel, onBack, goTo }: { hotel: MyHotel; onBack: () => void; goTo: (step: number) => void }) {
  const t = useTranslations("Onboarding");
  const tm = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const { data: calendar } = useApiData(getCalendarAction, null);
  const [confirming, setConfirming] = useState(false);

  const facilities = (["restaurant", "lift", "pool", "parking"] as const).filter((f) => hotel.facilities[f]).map((f) => tm(`facilities.${f}`));
  const routed = (["invoices", "vacancies", "faults", "alerts"] as const).filter((type) => hotel.notify[type]);

  const confirm = async () => {
    setConfirming(true);
    const res = await completeOnboardingAction();
    if (res.ok) {
      toast.success(t("done"));
      // Full load: the dashboard layout reads the finished onboarding.
      window.location.href = "/dashboard";
    } else {
      toast.error(res.error || tc("error"));
      setConfirming(false);
    }
  };


  return (
    <div className={cardClass}>
      <h2 className="font-display text-2xl text-gray-950">{t("steps.confirm.title")}</h2>
      <p className="mt-1 text-sm text-gray-500">{t("steps.confirm.description")}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Block goTo={goTo} editLabel={tc("edit")} step={1} title={t("steps.company.title")}>
          <p className="font-medium text-gray-900">{hotel.name}</p>
          <p>{hotel.address}, {hotel.city} · {optionLabel("regions", hotel.region)}</p>
          <p>{tm("company.kvk")}: {hotel.kvkNumber || "—"}</p>
          <p>{hotel.contactPerson || "—"} · {hotel.phone || "—"}</p>
          <p>{hotel.emails.general}</p>
        </Block>
        <Block goTo={goTo} editLabel={tc("edit")} step={2} title={t("steps.facilities.title")}>
          <p>{tm("facilities.rooms")}: {hotel.facilities.rooms ?? "—"}</p>
          <p>{facilities.length ? facilities.join(", ") : t("steps.confirm.noFacilities")}</p>
        </Block>
        <Block goTo={goTo} editLabel={tc("edit")} step={3} title={t("steps.registers")}>
          <p>{t("steps.confirm.contracts", { count: calendar?.summary.contracts ?? 0 })}</p>
          <p>{t("steps.confirm.permits", { count: calendar?.summary.permits ?? 0 })}</p>
          <p>{t("steps.confirm.faults", { count: calendar?.summary.faultContacts ?? 0 })}</p>
        </Block>
        <Block goTo={goTo} editLabel={tc("edit")} step={6} title={t("steps.guide.title")}>
          <div className="flex gap-3">
            <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
              <Thumb src={hotel.image} alt="" />
            </span>
            <p className="line-clamp-3">{hotel.description || "—"}</p>
          </div>
        </Block>
        <Block goTo={goTo} editLabel={tc("edit")} step={7} title={t("steps.emails.title")}>
          <p>{tm("emails.types.general")}: {hotel.emails.general}</p>
          {routed.map((type) => (
            <p key={type}>
              {tm(`emails.types.${type}`)}: {hotel.emails[type] || hotel.emails.general}
            </p>
          ))}
        </Block>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <button type="button" onClick={onBack} className={outlineButtonClass}>
          {t("back")}
        </button>
        <button type="button" onClick={confirm} disabled={confirming} className={primaryButtonClass}>
          <BiCheckCircle size={18} /> {confirming ? tc("saving") : t("confirm")}
        </button>
      </div>
    </div>
  );
}
