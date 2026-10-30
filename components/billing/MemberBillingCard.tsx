"use client";

import { adminCancelSubscriptionAction, adminMemberBillingAction, adminStartSubscriptionAction } from "@/app/actions/billing";
import { cardClass, cardTitleClass, outlineButtonClass } from "@/components/shared/form-styles";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { InvoiceStatusBadge, useDate, useMoney } from "./shared";

/** Admin hotel/supplier page: membership and the latest invoices. */
export function MemberBillingCard({ hotel, supplier, canStart = true }: { hotel?: string; supplier?: string; canStart?: boolean }) {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const { data, loading, reload } = useApiData(adminMemberBillingAction, { hotel, supplier });
  const sub = data?.subscription;

  const run = async (fn: () => Promise<{ ok: boolean; error?: string }>, confirmText: string, done: string) => {
    if (!window.confirm(confirmText)) return;
    const res = await fn();
    if (res.ok) {
      toast.success(done);
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>{t("membership")}</h2>
      {loading ? (
        <div className="h-16 animate-pulse rounded bg-gray-50" />
      ) : (
        <>
          {sub ? (
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-gray-900">
                  {t(`plan.${sub.plan}`)} · {t(`interval.${sub.interval}`)}
                </span>
                <StatusBadge tone={sub.status === "active" ? "green" : "grey"}>{t(`subStatus.${sub.status}`)}</StatusBadge>
              </div>
              <p className="text-gray-600">{t("currentPeriod", { start: date(sub.currentPeriodStart), end: date(sub.currentPeriodEnd) })}</p>
              {sub.status === "active" && (
                <button
                  type="button"
                  onClick={() => run(() => adminCancelSubscriptionAction(sub._id), t("confirmStop"), t("stopped"))}
                  className="mt-2 text-xs font-medium text-ember-600 hover:underline"
                >
                  {t("stopMembership")}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600">
              <p>{canStart ? t("noMembershipAdmin") : t("commissionMember")}</p>
              {canStart && (
                <button type="button" onClick={() => run(() => adminStartSubscriptionAction({ hotel, supplier }), t("confirmStart"), t("started"))} className={outlineButtonClass}>
                  {t("startMembership")}
                </button>
              )}
            </div>
          )}
          <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100">
            {(data?.invoices ?? []).slice(0, 5).map((inv) => (
              <li key={inv._id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{inv.number}</span>
                  <span className="block text-xs text-gray-500">{t(`kind.${inv.kind}`)}</span>
                </span>
                <span className="text-right">
                  {money(inv.total)}
                  <span className="block">
                    <InvoiceStatusBadge invoice={inv} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {(data?.invoices.length ?? 0) > 0 && (
            <Link href="/admin/invoices" className="mt-2 inline-block text-xs font-medium text-primary-dark hover:underline">
              {t("allInvoices")}
            </Link>
          )}
        </>
      )}
    </div>
  );
}
