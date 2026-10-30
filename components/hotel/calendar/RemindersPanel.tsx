"use client";

import type { CalendarEvent } from "@/app/actions/myHotel";
import { REMINDER_DAYS, daysUntil } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { BiBell, BiCheckCircle } from "react-icons/bi";
import { eventHref, KIND_STYLE } from "./YearCalendar";

/** What needs attention now: already passed, or due within 30 days. */
export function RemindersPanel({ events, overdue }: { events: CalendarEvent[]; overdue: CalendarEvent[] }) {
  const t = useTranslations("Calendar");
  const format = useFormatter();
  const soon = events.filter((e) => {
    const days = daysUntil(e.date);
    return days >= 0 && days <= REMINDER_DAYS;
  });
  const items = [...overdue, ...soon];

  return (
    <section aria-labelledby="reminders-title" className="rounded border border-gray-200 bg-white p-6">
      <h2 id="reminders-title" className="flex items-center gap-2 font-display text-2xl text-gray-950">
        <BiBell className="text-brass-500" size={22} /> {t("remindersTitle")}
      </h2>
      <p className="mt-1 text-xs text-gray-500">{t("remindersHint", { days: REMINDER_DAYS })}</p>
      {items.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-moss-600">
          <BiCheckCircle size={18} /> {t("allClear")}
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {items.map((event) => {
            const days = daysUntil(event.date);
            return (
              <li key={`${event.kind}-${event.refId}-${event.date}`}>
                <Link href={eventHref(event)} className="flex items-start justify-between gap-3 py-3 hover:bg-gray-50/60">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900">{event.title}</span>
                    <span className="text-xs text-gray-500">
                      {t(`kinds.${event.kind}`)} · {format.dateTime(new Date(event.date), { dateStyle: "medium", timeZone: "UTC" })}
                    </span>
                  </span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", days < 0 ? "bg-ember-600 text-white" : KIND_STYLE[event.kind].chip)}>
                    {days < 0 ? t("passed", { days: -days }) : days === 0 ? t("today") : t("inDays", { days })}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
