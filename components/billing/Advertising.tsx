"use client";

import {
  adAvailabilityAction,
  bookAdAction,
  cancelAdBookingAction,
  myAdBookingsAction,
  type AdBlock,
  type AdPeriod,
} from "@/app/actions/billing";
import { listMyVacanciesAction, type MyVacancy } from "@/app/actions/myVacancy";
import type { ActionResponse } from "@/lib/api";
import { cardClass, cardTitleClass, inputClass, labelClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCreditCard } from "react-icons/bi";
import { AdStatusBadge, useDate, useMoney } from "./shared";

const BLOCKS_FOR: Record<"hotel" | "supplier", AdBlock[]> = { hotel: ["hotels", "jobs"], supplier: ["suppliers"] };
const noVacancies = async (): Promise<ActionResponse<MyVacancy[]>> => ({ ok: true, data: [] });

/**
 * Reclame — /hotel/advertising and /supplier/advertising (briefing §2.1,
 * §3.15, §4.9): a sponsored spot on the homepage for a month or a quarter.
 * A taken spot can still be booked: it starts when the one before ends.
 */
const Advertising = ({ portal }: { portal: "hotel" | "supplier" }) => {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const blocks = BLOCKS_FOR[portal];
  const availability = useApiData(adAvailabilityAction, undefined);
  const bookings = useApiData(myAdBookingsAction, undefined);
  const vacancies = useApiData(portal === "hotel" ? listMyVacanciesAction : noVacancies, undefined);
  const published = (vacancies.data ?? []).filter((v) => v.status === "published");

  const [block, setBlock] = useState<AdBlock>(blocks[0]);
  const [position, setPosition] = useState(1);
  const [period, setPeriod] = useState<AdPeriod>("month");
  const [vacancy, setVacancy] = useState("");
  const [busy, setBusy] = useState(false);

  const blockData = availability.data?.find((b) => b.block === block);
  const spot = blockData?.positions.find((p) => p.position === position);
  const price = blockData?.prices[period] ?? 0;

  const book = async () => {
    if (block === "jobs" && !vacancy) return toast.error(t("chooseJob"));
    setBusy(true);
    const res = await bookAdAction({ block, position, period, vacancy: block === "jobs" ? vacancy : undefined });
    setBusy(false);
    if (!res.ok || !res.data) return toast.error(res.error || tc("error"));
    if (res.data.invoice.paymentUrl) {
      window.location.href = res.data.invoice.paymentUrl;
      return;
    }
    toast.success(t("bookedInvoice", { number: res.data.invoice.number }));
    bookings.reload();
    availability.reload();
  };

  const cancel = async (id: string) => {
    if (!window.confirm(t("confirmCancelBooking"))) return;
    const res = await cancelAdBookingAction(id);
    if (res.ok) {
      toast.success(t("bookingCancelled"));
      bookings.reload();
      availability.reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("adsTitle")} description={t("adsSubtitle")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={cardTitleClass}>{t("spots")}</h2>
          {availability.loading ? (
            <div className="h-40 animate-pulse rounded bg-gray-50" />
          ) : (
            <div className="space-y-5">
              {availability.data
                ?.filter((b) => blocks.includes(b.block))
                .map((b) => (
                  <div key={b.block}>
                    <p className="text-sm font-medium text-gray-900">{t(`block.${b.block}`)}</p>
                    <p className="text-xs text-gray-500">{t(`blockHint.${b.block}`)}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {b.positions.map((p) => {
                        const selected = block === b.block && position === p.position;
                        return (
                          <button
                            key={p.position}
                            type="button"
                            onClick={() => {
                              setBlock(b.block);
                              setPosition(p.position);
                            }}
                            className={cn(
                              "rounded-lg border p-4 text-left transition-colors",
                              selected ? "border-primary bg-brass-100/50 ring-2 ring-primary/20" : "border-gray-200 hover:border-primary",
                            )}
                          >
                            <p className="font-display text-lg text-gray-950">{t("position", { n: p.position })}</p>
                            <p className={cn("mt-1 text-xs font-medium", p.liveUntil ? "text-brass-700" : "text-moss-600")}>
                              {p.liveUntil ? t("takenUntil", { date: date(p.liveUntil) }) : t("free")}
                            </p>
                            {p.waiting > 0 && <p className="text-xs text-gray-500">{t("waiting", { count: p.waiting })}</p>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("book")}</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              {t(`block.${block}`)} · {t("position", { n: position })}
            </p>
            <div>
              <p className={labelClass}>{t("period")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["month", "quarter"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      period === p ? "border-primary bg-brass-100/50 font-medium text-gray-950" : "border-gray-200 text-gray-600 hover:border-primary",
                    )}
                  >
                    {t(`adPeriod.${p}`)}
                    <span className="block text-xs text-gray-500">{blockData ? money(blockData.prices[p]) : "—"}</span>
                  </button>
                ))}
              </div>
            </div>
            {block === "jobs" && (
              <label className="block">
                <span className={labelClass}>{t("job")}</span>
                <select value={vacancy} onChange={(e) => setVacancy(e.target.value)} className={`${inputClass} mt-2`}>
                  <option value="">{t("chooseJob")}</option>
                  {published.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.title}
                    </option>
                  ))}
                </select>
                {!vacancies.loading && published.length === 0 && <span className="mt-1 block text-xs text-gray-500">{t("noPublishedJobs")}</span>}
              </label>
            )}
            {spot && <p className="text-xs text-gray-500">{t("startsOn", { date: date(spot.nextStart) })}</p>}
            {blockData && (
              <p className="border-t border-gray-100 pt-3 text-sm text-gray-700">
                {t("toPay")} <span className="font-medium text-gray-950">{money(price)}</span> <span className="text-xs text-gray-500">{t("plusVat")}</span>
              </p>
            )}
            <button type="button" onClick={book} disabled={busy || !blockData} className={`${primaryButtonClass} w-full`}>
              <BiCreditCard size={16} /> {busy ? tc("saving") : t("bookAndPay")}
            </button>
            <p className="text-xs text-gray-500">{t("bookHint")}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">{t("myBookings")}</h2>
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("spot")}</th>
                <th className="px-5 py-3 font-semibold">{t("period")}</th>
                <th className="px-5 py-3 font-semibold">{t("dates")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={5} loading={bookings.loading} error={bookings.error} empty={(bookings.data ?? []).length === 0} emptyText={t("noBookings")} />
              {!bookings.loading &&
                bookings.data?.map((b) => (
                  <tr key={b._id}>
                    <td className="px-5 py-3">
                      <span className="font-medium text-gray-900">
                        {t(`block.${b.block}`)} · {t("position", { n: b.position })}
                      </span>
                      {b.vacancy && <span className="block text-xs text-gray-500">{b.vacancy.title}</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{t(`adPeriod.${b.period}`)}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-700">{b.startsAt ? `${date(b.startsAt)} – ${date(b.endsAt)}` : "—"}</td>
                    <td className="px-5 py-3">
                      <AdStatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {b.status === "pending_payment" && b.invoice?.paymentUrl && (
                          <a href={b.invoice.paymentUrl} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
                            {t("payNow")}
                          </a>
                        )}
                        {b.status === "pending_payment" && (
                          <button type="button" onClick={() => cancel(b._id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-primary">
                            {tc("cancel")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
