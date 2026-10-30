"use client";

import { getPushKeyAction, subscribePushAction, unsubscribePushAction } from "@/app/actions/push";
import { outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiBell, BiBellOff, BiMobileAlt } from "react-icons/bi";

type State = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on" | "server-off";

const base64ToBytes = (value: string) => {
  const padded = (value + "=".repeat((4 - (value.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

/**
 * Push notifications on this device (PWA). On iPhone push only works once the
 * dashboard is added to the home screen (iOS 16.4+), so we explain that.
 */
export function PushToggle() {
  const t = useTranslations("Notifications.push");
  const tc = useTranslations("Common");
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const check = async () => {
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        return setState(ios && !standalone ? "ios-install" : "unsupported");
      }
      const key = await getPushKeyAction();
      if (!key.data?.publicKey) return setState("server-off");
      if (Notification.permission === "denied") return setState("denied");
      const registration = await navigator.serviceWorker.ready;
      setState((await registration.pushManager.getSubscription()) ? "on" : "off");
    };
    check().catch(() => setState("unsupported"));
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      if ((await Notification.requestPermission()) !== "granted") return setState("denied");
      const key = await getPushKeyAction();
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64ToBytes(key.data!.publicKey) });
      const json = subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      const res = await subscribePushAction({ endpoint: json.endpoint, keys: json.keys });
      if (!res.ok) {
        await subscription.unsubscribe();
        return toast.error(res.error || tc("error"));
      }
      toast.success(t("enabled"));
      setState("on");
    } catch {
      toast.error(tc("error"));
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await unsubscribePushAction(subscription.endpoint);
      await subscription.unsubscribe();
    }
    setBusy(false);
    toast.success(t("disabled"));
    setState("off");
  };

  if (state === "loading") return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass-100 text-brass-600">
          <BiMobileAlt size={18} />
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{t("title")}</p>
          <p className="text-xs text-gray-500">{t(`state.${state}`)}</p>
        </div>
      </div>
      {state === "off" && (
        <button type="button" onClick={enable} disabled={busy} className={primaryButtonClass}>
          <BiBell size={16} /> {t("enable")}
        </button>
      )}
      {state === "on" && (
        <button type="button" onClick={disable} disabled={busy} className={outlineButtonClass}>
          <BiBellOff size={16} /> {t("disable")}
        </button>
      )}
    </div>
  );
}
