"use client";

import { cancelMembershipAction, changePaymentMethodAction, myBillingAction, type PaymentMethod } from "@/app/actions/billing";
import { cardClass, cardTitleClass, dangerButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { BiInfoCircle } from "react-icons/bi";
import { InvoiceTable, useDate, useMoney } from "./shared";

/** Two options side by side, e.g. direct debit / invoice. */
function Segmented<T extends string>({ options, value, label, onChange }: { options: { value: T; label: string }[]; value: T; label: string; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="mt-2 inline-flex flex-wrap rounded-lg border border-gray-200 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => value !== o.value && onChange(o.value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              value === o.value ? "bg-primary text-white" : "text-gray-600 hover:text-primary-dark",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Facturen — /hotel/invoices and /supplier/invoices (Master Briefing v4):
 * the membership (yearly, by rooms for hotels; free periods), how it is paid,
 * cancelling (agreements §6), the prices and every invoice.
 */
const MyBilling = ({ portal }: { portal: "hotel" | "supplier" }) => {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const { data, loading, error, reload } = useApiData(myBillingAction, undefined);

  // Back from a Mollie checkout: /…/invoices?paid=HC-2026-0001
  useEffect(() => {
    const paid = new URLSearchParams(window.location.search).get("paid");
    if (!paid) return;
    toast.success(t("thanks", { number: paid }));
    window.history.replaceState(null, "", window.location.pathname);
  }, [t]);

  const sub = data?.subscription;
  const prices = data?.prices;
  const active = sub?.status === "active";
  const free = Boolean(sub?.freeUntil && new Date(sub.freeUntil) > new Date());

  const savePaymentMethod = async (m: PaymentMethod) => {
    const res = await changePaymentMethodAction(m);
    if (res.ok) {
      toast.success(m === "sepa" ? t("methodSavedSepa") : t("methodSavedInvoice"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  const cancel = async () => {
    if (!window.confirm(t(portal === "supplier" && free ? "confirmCancelFree" : "confirmCancel", { months: prices?.noticeMonths ?? 3 }))) return;
    const res = await cancelMembershipAction();
    if (res.ok && res.data) {
      toast.success(t("cancelledUntil", { date: date(res.data.endsAt) }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  const tierOf = (rooms: number | null) => prices?.hotelTiers.find((tier) => rooms != null && (tier.maxRooms == null || rooms <= tier.maxRooms))?.key;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <h2 className={cardTitleClass}>{t("membership")}</h2>
          {loading ? (
            <div className="h-20 animate-pulse rounded bg-gray-50" />
          ) : sub ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl text-gray-950">{t(`plan.${sub.plan}`)}</p>
                  {portal === "hotel" && data?.rooms != null && tierOf(data.rooms) && (
                    <p className="mt-1 text-sm text-gray-600">{t("tierLine", { tier: t(`tier.${tierOf(data.rooms)}`), rooms: data.rooms })}</p>
                  )}
                  {sub.tier === "founding" && <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brass-600">{t("foundingMember")}</p>}
                  {free ? (
                    <p className="mt-1 text-sm text-gray-600">{t("freeUntil", { date: date(sub.freeUntil) })}</p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">{t("currentPeriod", { start: date(sub.currentPeriodStart), end: date(sub.currentPeriodEnd) })}</p>
                  )}
                  {data && <p className="mt-1 text-sm text-gray-600">{t(free ? "thenPerYear" : "pricePerYear", { price: money(data.nextYearPrice) })}</p>}
                  {sub.status === "cancelled" && sub.endsAt && <p className="mt-2 text-sm font-medium text-ember-600">{t("endsOn", { date: date(sub.endsAt) })}</p>}
                </div>
                <StatusBadge tone={active ? "green" : "grey"}>{t(`subStatus.${sub.status}`)}</StatusBadge>
              </div>

              {active && (
                <div className="flex flex-wrap items-end justify-between gap-6 border-t border-gray-100 pt-5">
                  <Segmented<PaymentMethod>
                    label={t("payBy")}
                    value={sub.paymentMethod}
                    options={[
                      { value: "sepa", label: t("method.sepa") },
                      { value: "invoice", label: t("method.invoice") },
                    ]}
                    onChange={savePaymentMethod}
                  />
                  <button type="button" onClick={cancel} className={dangerButtonClass}>
                    {t("cancelMembership")}
                  </button>
                </div>
              )}
              {active && <p className="text-xs text-gray-500">{t("cancelHint", { months: prices?.noticeMonths ?? 3 })}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-600">{portal === "hotel" ? t("noMembershipHotel") : t("noMembershipSupplier")}</p>
          )}
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("prices")}</h2>
          {prices && (
            <ul className="space-y-3 text-sm text-gray-700">
              {portal === "hotel" ? (
                <>
                  {prices.hotelTiers.map((tier) => (
                    <li key={tier.key} className="flex justify-between gap-3">
                      <span>
                        {t(`tier.${tier.key}`)}
                        <span className="block text-xs text-gray-500">{tier.maxRooms ? t("upToRooms", { rooms: tier.maxRooms }) : t("moreRooms", { rooms: 40 })}</span>
                      </span>
                      <span className="font-medium">{t("perYear", { price: money(tier.price) })}</span>
                    </li>
                  ))}
                  <li className="text-xs text-gray-500">{t("foundingNote", { months: prices.foundingFreeMonths })}</li>
                </>
              ) : (
                <>
                  {(["supplier-project", "supplier-contract"] as const).map((plan) => (
                    <li key={plan} className="flex justify-between gap-3">
                      <span>{t(`plan.${plan}`)}</span>
                      <span className="text-right font-medium">
                        {t("perYear", { price: money(prices.suppliers[plan].year) })}
                        <span className="block text-xs font-normal text-gray-500">{t("perMonth", { price: money(prices.suppliers[plan].month) })}</span>
                      </span>
                    </li>
                  ))}
                  <li className="text-xs font-medium text-moss-600">{t("supplierFree", { date: date(prices.supplierFreeUntil) })}</li>
                </>
              )}
              <li className="border-t border-gray-100 pt-2 text-xs text-gray-500">{t("zeroCommission")} · {t("exclVat", { rate: prices.vatRate })}</li>
            </ul>
          )}
        </div>
      </div>

      {data && !data.online.moneybird && (
        <p className="flex items-start gap-2 rounded border border-gray-200 bg-white p-4 text-sm text-gray-600">
          <BiInfoCircle size={18} className="mt-0.5 shrink-0 text-brass-600" /> {t("payByTransfer")}
        </p>
      )}

      <InvoiceTable invoices={data?.invoices ?? []} loading={loading} error={error} />
    </div>
  );
};

export default MyBilling;
