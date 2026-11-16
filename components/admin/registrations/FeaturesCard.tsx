"use client";

import { getSettingsAction, updateFeaturesAction, type FeatureKey } from "@/app/actions/registration";
import { Toggle } from "@/components/shared/form/Toggle";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const KEYS: FeatureKey[] = ["vouchers", "advertising", "reviews"];

/**
 * Phase 2 switches (Master Briefing v4): the code stays, the features are
 * hidden until switched on here — website, dashboards and API together.
 */
export function FeaturesCard() {
  const t = useTranslations("Registrations.features");
  const tc = useTranslations("Common");
  const router = useRouter();
  const { data, reload } = useApiData(getSettingsAction, undefined);
  const [saving, setSaving] = useState<FeatureKey | null>(null);
  if (!data) return <div className="h-24 animate-pulse rounded border border-gray-200 bg-white" />;

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <p className="text-sm font-semibold text-gray-900">{t("title")}</p>
      <p className="mt-0.5 text-xs text-gray-500">{t("hint")}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {KEYS.map((key) => (
          <Toggle
            key={key}
            checked={data.features[key]}
            onChange={async (on) => {
              setSaving(key);
              const res = await updateFeaturesAction({ [key]: on });
              setSaving(null);
              if (res.ok) {
                toast.success(on ? t("on") : t("off"));
                reload();
                router.refresh();
              } else toast.error(res.error || tc("error"));
            }}
            label={saving === key ? tc("saving") : t(`${key}.label`)}
            description={t(`${key}.description`)}
          />
        ))}
      </div>
    </div>
  );
}
