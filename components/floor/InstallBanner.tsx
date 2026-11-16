"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { BiX } from "react-icons/bi";

const KEY = "hc-install-banner-closed";
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Show on phones, not when already installed, until closed once. */
function shouldShow() {
  try {
    if (localStorage.getItem(KEY) === "1") return false;
  } catch {
    return false;
  }
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return !standalone && window.matchMedia("(max-width: 900px)").matches;
}

/**
 * First mobile login (Master Briefing v4): how to add the floor app to the
 * home screen. Safari: Share → Add to Home Screen; Chrome: menu → Install app.
 */
export function InstallBanner() {
  const t = useTranslations("Floor.install");
  const show = useSyncExternalStore(subscribe, shouldShow, () => false);
  if (!show) return null;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <aside className="relative rounded border border-brass-400/40 bg-brass-100/70 p-4 pr-10 text-sm text-gray-800">
      <p className="font-semibold text-gray-950">{t("title")}</p>
      <p className="mt-1">{ios ? t("ios") : t("android")}</p>
      <button
        type="button"
        aria-label={t("close")}
        onClick={() => {
          try {
            localStorage.setItem(KEY, "1");
          } catch {}
          listeners.forEach((l) => l());
        }}
        className="absolute right-2 top-2 grid size-8 place-items-center rounded text-gray-500 hover:bg-white/60"
      >
        <BiX size={18} />
      </button>
    </aside>
  );
}
