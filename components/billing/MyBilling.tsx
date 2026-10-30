"use client";

import { changeIntervalAction, myBillingAction, type BillingInterval } from "@/app/actions/billing";
import { cardClass, cardTitleClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { BiInfoCircle } from "react-icons/bi";
import { InvoiceTable, useDate, useMoney } from "./shared";

/**
 * Facturen — /hotel/invoices and /supplier/invoices (briefing §3.9): the
 * membership, the prices and every invoice with a pay link.
 */
const MyBilling = ({ portal }: { portal: "hotel" | "supplier" }) => {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const { data, loading, error, reload } = useApiData(myBillingAction, undefined);

  // Back from the Mollie checkout: /…/invoices?paid=HC-2026-0001
  useEffect(() => {
    const paid = new URLSearchParams(window.location.search).get("paid");
    if (!paid) return;
    toast.success(t("thanks", { number: paid }));
    window.history.replaceState(null, "", window.location.pathname);
  }, [t]);

  const sub = data?.subscription;
  const prices = data?.prices;
  const hasContract = portal === "supplier" && data?.plan === "contract";

  const switchInterval = async (interval: BillingInterval) => {
    const res = await changeIntervalAction(interval);
    if (res.ok) {
      toast.success(t("intervalSaved"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={cardTitleClass}>{t("membership")}</h2>
          {loading ? (
            <div className="h-20 animate-pulse rounded bg-gray-50" />
          ) : sub ? (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-gray-950">{t(`plan.${sub.plan}`)}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {sub.status === "active"
                    ? t("currentPeriod", { start: date(sub.currentPeriodStart), end: date(sub.currentPeriodEnd) })
                    : t("endsOn", { date: date(sub.currentPeriodEnd) })}
                </p>
                {prices && (
                  <p className="mt-1 text-sm text-gray-600">
                    {sub.plan === "hotel"
                      ? t("pricePerYear", { price: money(prices.subscriptions.hotel.year) })
                      : sub.interval === "month"
                        ? t("pricePerMonth", { price: money(prices.subscriptions["supplier-contract"].month) })
                        : t("pricePerYear", { price: money(prices.subscriptions["supplier-contract"].year) })}
                  </p>
                )}
              </div>
              <StatusBadge tone={sub.status === "active" ? "green" : "grey"}>{t(`subStatus.${sub.status}`)}</StatusBadge>
              {sub.plan === "supplier-contract" && sub.status === "active" && (
                <div className="w-full border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("payEvery")}</p>
                  <div className="mt-2 inline-flex rounded-lg border border-gray-200 p-1">
                    {(["month", "year"] as const).map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => sub.interval !== i && switchInterval(i)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${sub.interval === i ? "bg-primary text-white" : "text-gray-600 hover:text-primary-dark"}`}
                      >
                        {t(`interval.${i}`)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{t("intervalHint")}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">{portal === "hotel" ? t("noMembershipHotel") : hasContract ? t("noMembershipContract") : t("commissionOnly", { percent: prices?.commissionPercent ?? 5 })}</p>
          )}
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("prices")}</h2>
          {prices && (
            <ul className="space-y-2 text-sm text-gray-700">
              {portal === "hotel" ? (
                <li className="flex justify-between gap-3">
                  <span>{t("plan.hotel")}</span>
                  <span className="font-medium">{t("perYear", { price: money(prices.subscriptions.hotel.year) })}</span>
                </li>
              ) : (
                <>
                  <li className="flex justify-between gap-3">
                    <span>{t("plan.supplier-contract")}</span>
                    <span className="text-right font-medium">
                      {t("perMonth", { price: money(prices.subscriptions["supplier-contract"].month) })}
                      <span className="block text-xs font-normal text-gray-500">{t("perYear", { price: money(prices.subscriptions["supplier-contract"].year) })}</span>
                    </span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>{t("commission")}</span>
                    <span className="font-medium">{prices.commissionPercent}%</span>
                  </li>
                </>
              )}
              <li className="flex justify-between gap-3">
                <span>{t("sponsoredSpot")}</span>
                <span className="text-right font-medium">
                  {t("perMonth", { price: money(prices.ads.month) })}
                  <span className="block text-xs font-normal text-gray-500">{t("perQuarter", { price: money(prices.ads.quarter) })}</span>
                </span>
              </li>
              {portal === "hotel" && (
                <li className="flex justify-between gap-3">
                  <span>{t("voucherPromotion")}</span>
                  <span className="text-right font-medium">
                    {t("perMonth", { price: money(prices.promotions.month) })}
                    <span className="block text-xs font-normal text-gray-500">{t("perQuarter", { price: money(prices.promotions.quarter) })}</span>
                  </span>
                </li>
              )}
              <li className="border-t border-gray-100 pt-2 text-xs text-gray-500">{t("exclVat", { rate: prices.vatRate })}</li>
            </ul>
          )}
        </div>
      </div>

      {data && !data.online.mollie && (
        <p className="flex items-start gap-2 rounded border border-gray-200 bg-white p-4 text-sm text-gray-600">
          <BiInfoCircle size={18} className="mt-0.5 shrink-0 text-brass-600" /> {t("payByTransfer")}
        </p>
      )}

      <InvoiceTable invoices={data?.invoices ?? []} loading={loading} error={error} />
    </div>
  );
};

export default MyBilling;
