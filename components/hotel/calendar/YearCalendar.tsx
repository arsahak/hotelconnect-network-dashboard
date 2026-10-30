"use client";

import type { CalendarEvent, CalendarKind } from "@/app/actions/myHotel";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";

export const KIND_STYLE: Record<CalendarKind, { dot: string; chip: string }> = {
  contract_end: { dot: "bg-brass-500", chip: "bg-brass-100 text-brass-700" },
  notice_deadline: { dot: "bg-ember-600", chip: "bg-ember-100 text-ember-600" },
  permit_expiry: { dot: "bg-moss-600", chip: "bg-moss-100 text-moss-600" },
};

export const eventHref = (e: CalendarEvent) => `/${e.refType === "contract" ? "contracts" : "permits"}/${e.refId}`;

/**
 * Year calendar (briefing §3.3): twelve months from this one, each listing
 * the contracts that end, the last days to cancel, and the permits that
 * expire. Built from the contract register and the permits page.
 */
export function YearCalendar({ from, events }: { from: string; events: CalendarEvent[] }) {
  const t = useTranslations("Calendar");
  const format = useFormatter();
  const start = new Date(from);
  const months = Array.from({ length: 12 }, (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1));
  const today = new Date();

  return (
    <section aria-labelledby="calendar-title" className="rounded border border-gray-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="calendar-title" className="font-display text-2xl text-gray-950">
          {t("title")}
        </h2>
        <ul className="flex flex-wrap gap-3 text-xs text-gray-600">
          {(Object.keys(KIND_STYLE) as CalendarKind[]).map((kind) => (
            <li key={kind} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", KIND_STYLE[kind].dot)} />
              {t(`kinds.${kind}`)}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {months.map((month) => {
          const inMonth = events.filter((e) => {
            const d = new Date(e.date);
            return d.getUTCFullYear() === month.getFullYear() && d.getUTCMonth() === month.getMonth();
          });
          const isCurrent = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
          return (
            <div
              key={month.toISOString()}
              className={cn("flex min-h-32 flex-col rounded-lg border p-3", isCurrent ? "border-primary bg-primary/[0.04]" : "border-gray-200")}
            >
              <div className="mb-2 flex items-baseline justify-between">
                <p className={cn("text-sm font-semibold capitalize", isCurrent ? "text-primary-dark" : "text-gray-900")}>
                  {format.dateTime(month, { month: "long" })}
                </p>
                <p className="text-xs text-gray-400">{month.getFullYear()}</p>
              </div>
              {inMonth.length === 0 ? (
                <p className="mt-auto text-xs text-gray-300">{t("nothing")}</p>
              ) : (
                <ul className="space-y-1.5">
                  {inMonth.map((event) => (
                    <li key={`${event.kind}-${event.refId}`}>
                      <Link href={eventHref(event)} className="group flex items-start gap-2 rounded px-1 py-0.5 hover:bg-gray-50">
                        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", KIND_STYLE[event.kind].dot)} />
                        <span className="min-w-0 text-xs leading-snug">
                          <span className="font-medium text-gray-900 group-hover:text-primary-dark">
                            {format.dateTime(new Date(event.date), { day: "numeric", timeZone: "UTC" })} · {event.title}
                          </span>
                          <span className="block text-gray-500">{t(`kinds.${event.kind}`)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
