"use client";

import { getSettingsAction, updateSettingsAction } from "@/app/actions/registration";
import { Toggle } from "@/components/shared/form/Toggle";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";

/** The test phase switch (briefing §1, §9): on = registration closed, visitors join the waitlist. */
export function TestPhaseCard() {
  const t = useTranslations("Registrations.testPhase");
  const tc = useTranslations("Common");
  const { data, reload } = useApiData(getSettingsAction, undefined);
  const [saving, setSaving] = useState(false);
  if (!data) return <div className="h-24 animate-pulse rounded border border-gray-200 bg-white" />;

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <Toggle
        checked={data.testPhase}
        onChange={async (testPhase) => {
          if (!testPhase && !window.confirm(t("confirmOpen"))) return;
          setSaving(true);
          const res = await updateSettingsAction(testPhase);
          setSaving(false);
          if (res.ok) {
            toast.success(testPhase ? t("closed") : t("opened"));
            reload();
          } else toast.error(res.error || tc("error"));
        }}
        label={saving ? tc("saving") : t("label")}
        description={data.testPhase ? t("on") : t("off")}
      />
    </div>
  );
}
