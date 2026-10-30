"use client";

import { promoteVoucherAction, type AdPeriod } from "@/app/actions/billing";
import { cardClass, cardTitleClass, primaryButtonClass } from "@/components/shared/form-styles";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCreditCard } from "react-icons/bi";
import { useDate, useMoney } from "./shared";

// Same defaults as the backend (config/billing.ts PROMOTION_PRICES), excl. VAT.
const PRICES: Record<AdPeriod, number> = { month: 15_000, quarter: 40_000 };

/** Briefing §3.10: put a voucher first in the slideshow for a month or a quarter. */
export function VoucherPromoteCard({ id, isActive, promotedUntil }: { id: string; isActive: boolean; promotedUntil: string | null }) {
  const t = useTranslations("HotelVouchers");
  const tb = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const [period, setPeriod] = useState<AdPeriod>("month");
  const [busy, setBusy] = useState(false);
  const promoted = promotedUntil && new Date(promotedUntil) > new Date();

  const promote = async () => {
    setBusy(true);
    const res = await promoteVoucherAction(id, period);
    setBusy(false);
    if (!res.ok || !res.data) return toast.error(res.error || tc("error"));
    if (res.data.invoice.paymentUrl) {
      window.location.href = res.data.invoice.paymentUrl;
      return;
    }
    toast.success(tb("bookedInvoice", { number: res.data.invoice.number }));
  };

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>{t("promote.title")}</h2>
      <p className="text-sm text-gray-600">{t("promote.text")}</p>
      {promoted && <p className="mt-3 rounded bg-moss-100 px-3 py-2 text-xs font-medium text-moss-600">{t("promote.until", { date: date(promotedUntil) })}</p>}
      {isActive ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
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
                {tb(`adPeriod.${p}`)}
                <span className="block text-xs text-gray-500">{money(PRICES[p])}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={promote} disabled={busy} className={`${primaryButtonClass} w-full`}>
            <BiCreditCard size={16} /> {promoted ? t("promote.extend") : t("promote.cta")}
          </button>
          <p className="text-xs text-gray-500">{tb("plusVat")} · {t("promote.hint")}</p>
        </div>
      ) : (
        <p className="mt-4 rounded bg-gray-50 px-3 py-2 text-xs text-gray-500">{t("promote.inactive")}</p>
      )}
    </div>
  );
}
