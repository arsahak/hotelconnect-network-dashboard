"use client";

import { updateMyHotelAction, type MyHotel, type NotificationChannel, type NotificationType } from "@/app/actions/myHotel";
import { inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { saveSection, SectionForm } from "./SectionForm";

const TYPES: NotificationType[] = ["compliance", "tender", "vacancy", "fault", "system", "advertising"];
const CHANNELS: NotificationChannel[] = ["both", "dashboard", "email"];

/**
 * My hotel: per kind of melding, email + dashboard, only dashboard or only
 * email (briefing §3.12 aanvulling). Only for hotels; suppliers always get both.
 */
export function NotificationChannelsSection({ hotel, onSaved }: { hotel: MyHotel; onSaved: (hotel: MyHotel) => void }) {
  const t = useTranslations("MyHotel.channels");
  const tc = useTranslations("Common");
  const [channels, setChannels] = useState<Record<NotificationType, NotificationChannel>>(() =>
    Object.fromEntries(TYPES.map((type) => [type, hotel.notificationChannels?.[type] ?? "both"])) as Record<NotificationType, NotificationChannel>,
  );
  const [push, setPush] = useState<Record<NotificationType, boolean>>(() =>
    Object.fromEntries(TYPES.map((type) => [type, hotel.notificationPush?.[type] ?? true])) as Record<NotificationType, boolean>,
  );
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    const saved = await saveSection(() => updateMyHotelAction({ notificationChannels: channels, notificationPush: push }), { success: t("saved"), error: tc("error") }, toast);
    setSubmitting(false);
    if (saved) onSaved(saved);
  };

  return (
    <SectionForm title={t("title")} description={t("description")} submitting={submitting} onSubmit={submit}>
      <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
        {TYPES.map((type) => (
          <div key={type} className="grid gap-3 p-4 md:grid-cols-[1fr_16rem_auto] md:items-center">
            <div>
              <label htmlFor={`channel-${type}`} className="block text-sm font-medium text-gray-900">
                {t(`types.${type}`)}
              </label>
              <p className="text-xs text-gray-500">{t(`hints.${type}`)}</p>
            </div>
            <select id={`channel-${type}`} value={channels[type]} onChange={(e) => setChannels((c) => ({ ...c, [type]: e.target.value as NotificationChannel }))} className={inputClass}>
              {CHANNELS.map((channel) => (
                <option key={channel} value={channel}>
                  {t(`options.${channel}`)}
                </option>
              ))}
            </select>
            <label className={`flex items-center gap-2 text-xs text-gray-600 ${channels[type] === "email" ? "opacity-40" : ""}`}>
              <input
                type="checkbox"
                checked={push[type] && channels[type] !== "email"}
                disabled={channels[type] === "email"}
                onChange={(e) => setPush((p) => ({ ...p, [type]: e.target.checked }))}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              {t("push")}
            </label>
          </div>
        ))}
      </div>
    </SectionForm>
  );
}
