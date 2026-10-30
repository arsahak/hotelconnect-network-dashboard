"use client";

import { getMyHotelAction, saveOnboardingStepAction, type MyHotel } from "@/app/actions/myHotel";
import { outlineButtonClass } from "@/components/shared/form-styles";
import { CompanySection } from "@/components/hotel/myHotel/CompanySection";
import { EmailsSection } from "@/components/hotel/myHotel/EmailsSection";
import { FacilitiesSection } from "@/components/hotel/myHotel/FacilitiesSection";
import { GuideSection } from "@/components/hotel/myHotel/GuideSection";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { ConfirmStep } from "./ConfirmStep";
import { ContractsStep, FaultsStep, PermitsStep } from "./RegisterSteps";

const STEPS = ["company", "facilities", "contracts", "permits", "faults", "guide", "emails", "confirm"] as const;

/**
 * One-time onboarding for a new hotel (briefing §3.2), in eight steps.
 * Progress is saved, so the manager can stop and continue later.
 */
const OnboardingWizard = () => {
  const t = useTranslations("Onboarding");
  const { data: loaded, loading, error } = useApiData(getMyHotelAction, null);
  const [hotel, setHotel] = useState<MyHotel | null>(null);
  const [step, setStep] = useState<number | null>(null);

  if (loading) return <div className="h-96 animate-pulse rounded border border-gray-200 bg-white" />;
  const current = hotel ?? loaded;
  if (!current) return <p className="rounded border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">{error}</p>;
  const active = step ?? Math.min(current.onboarding.step || 1, 8);

  const goTo = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (next > (current.onboarding.step || 1)) {
      saveOnboardingStepAction(next).then((res) => {
        if (res.ok && res.data) setHotel({ ...current, onboarding: res.data });
      });
    }
  };
  const saved = (updated: MyHotel) => {
    setHotel(updated);
    goTo(active + 1);
  };
  const back = (
    <button type="button" onClick={() => goTo(active - 1)} className={outlineButtonClass}>
      {t("back")}
    </button>
  );
  const continueLabel = t("saveContinue");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brass-600">{t("eyebrow", { number: current.memberNumber })}</p>
        <h1 className="heading-strong mt-2 font-display text-4xl text-gray-950">{t("title", { name: current.name })}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500">{t("intro")}</p>
      </div>

      {/* Progress */}
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {STEPS.map((key, index) => {
          const number = index + 1;
          const done = number < active;
          const reachable = number <= Math.max(current.onboarding.step || 1, active);
          return (
            <li key={key}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => goTo(number)}
                aria-current={number === active ? "step" : undefined}
                className="group flex w-full flex-col items-start gap-1.5 text-left disabled:cursor-not-allowed"
              >
                <span className={cn("h-1.5 w-full rounded-full transition-colors", number <= active ? "bg-primary" : "bg-gray-200")} />
                <span className={cn("flex items-center gap-1 text-[11px] font-medium leading-tight", number === active ? "text-primary-dark" : done ? "text-gray-700" : "text-gray-400")}>
                  {done && <BiCheck size={13} />}
                  {number}. {t(`steps.${key}.short`)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {active === 1 && <CompanySection quiet hotel={current} onSaved={saved} submitLabel={continueLabel} />}
      {active === 2 && <FacilitiesSection quiet hotel={current} onSaved={saved} submitLabel={continueLabel} secondary={back} />}
      {active === 3 && <ContractsStep onBack={() => goTo(2)} onNext={() => goTo(4)} />}
      {active === 4 && <PermitsStep onBack={() => goTo(3)} onNext={() => goTo(5)} />}
      {active === 5 && <FaultsStep onBack={() => goTo(4)} onNext={() => goTo(6)} />}
      {active === 6 && <GuideSection quiet hotel={current} onSaved={saved} submitLabel={continueLabel} secondary={back} />}
      {active === 7 && <EmailsSection quiet hotel={current} onSaved={saved} submitLabel={continueLabel} secondary={back} />}
      {active === 8 && <ConfirmStep hotel={current} onBack={() => goTo(7)} goTo={goTo} />}
    </div>
  );
};

export default OnboardingWizard;
