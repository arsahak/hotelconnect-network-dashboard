"use client";

import { unreadCountAction } from "@/app/actions/notification";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";

const POLL_MS = 60_000;

/** Bell in the top bar with the number of unread meldingen; opens /notifications. */
export function NotificationBell() {
  const t = useTranslations("Notifications");
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  // Refresh on every page change and once a minute.
  useEffect(() => {
    let current = true;
    const load = () =>
      unreadCountAction().then((res) => {
        if (current && res.ok && res.data) setUnread(res.data.unread);
      });
    load();
    const timer = window.setInterval(load, POLL_MS);
    return () => {
      current = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  return (
    <Link
      href="/notifications"
      title={t("title")}
      className="relative grid h-10 w-10 place-items-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      <BiBell size={21} />
      {unread > 0 && (
        <span className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-ember-600 px-1 text-[10px] font-semibold leading-[18px] text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
      <span className="sr-only">{t("unread", { count: unread })}</span>
    </Link>
  );
}
