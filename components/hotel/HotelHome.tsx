"use client";

import { getCalendarAction } from "@/app/actions/myHotel";
import { RemindersPanel } from "@/components/hotel/calendar/RemindersPanel";
import { YearCalendar } from "@/components/hotel/calendar/YearCalendar";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { BiCheckShield, BiFile, BiWallet, BiWrench } from "react-icons/bi";

function Stat({ href, icon, label, value }: { href: string; icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded border border-gray-200 bg-white p-5 transition-colors hover:border-primary/40">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-brass-100 text-brass-600">{icon}</span>
      <span>
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block font-display text-2xl text-gray-950">{value}</span>
      </span>
    </Link>
  );
}

/** Hotel manager's start page (briefing §3.3): year calendar on top. */
const HotelHome = () => {
  const t = useTranslations("Dashboard");
  const tCal = useTranslations("Calendar");
  const format = useFormatter();
  const { name, organisation } = useSessionUser();
  const { data, loading, error } = useApiData(getCalendarAction, null);
  const firstName = name.split(" ")[0] || name;


  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("welcome", { name: firstName })} description={organisation ? `${organisation} · ${t("intro.hotel_manager")}` : t("intro.hotel_manager")} />

      {loading ? (
        <div className="h-96 animate-pulse rounded border border-gray-200 bg-white" />
      ) : !data ? (
        <p className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">{error}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat href="/hotel/contracts" icon={<BiFile size={20} />} label={tCal("stats.contracts")} value={data.summary.contracts} />
            <Stat
              href="/hotel/contracts"
              icon={<BiWallet size={20} />}
              label={tCal("stats.costPerYear")}
              value={data.summary.costPerYear !== null ? format.number(data.summary.costPerYear, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }) : "—"}
            />
            <Stat href="/hotel/permits" icon={<BiCheckShield size={20} />} label={tCal("stats.permits")} value={data.summary.permits} />
            <Stat href="/hotel/faults" icon={<BiWrench size={20} />} label={tCal("stats.faultContacts")} value={data.summary.faultContacts} />
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <YearCalendar from={data.from} events={data.events} />
            </div>
            <RemindersPanel events={data.events} overdue={data.overdue} />
          </div>
        </>
      )}
    </div>
  );
};

export default HotelHome;
