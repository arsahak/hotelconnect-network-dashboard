"use client";

import {
  adminCancelInvoiceAction,
  adminMarkInvoicePaidAction,
  type AdStatus,
  type AdminInvoice,
  type Invoice,
  type InvoiceStatus,
} from "@/app/actions/billing";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BiCreditCard, BiLinkExternal } from "react-icons/bi";

/** Cents → "€ 499,00" in the dashboard language. */
export function useMoney() {
  const format = useFormatter();
  return (cents: number) => format.number(cents / 100, { style: "currency", currency: "EUR" });
}

/** Dates are stored in UTC; show them as a medium date. */
export function useDate() {
  const format = useFormatter();
  return (value: string | null | undefined) => (value ? format.dateTime(new Date(value), { dateStyle: "medium" }) : "—");
}

const INVOICE_TONES: Record<InvoiceStatus, "brass" | "green" | "grey"> = { open: "brass", paid: "green", cancelled: "grey" };

export function InvoiceStatusBadge({ invoice }: { invoice: Pick<Invoice, "status" | "dueDate"> }) {
  const t = useTranslations("Billing");
  const overdue = invoice.status === "open" && new Date(invoice.dueDate) < new Date();
  return <StatusBadge tone={overdue ? "red" : INVOICE_TONES[invoice.status]}>{overdue ? t("status.overdue") : t(`status.${invoice.status}`)}</StatusBadge>;
}

const AD_TONES: Record<AdStatus, "brass" | "green" | "grey" | "red"> = {
  pending_payment: "brass",
  queued: "brass",
  live: "green",
  ended: "grey",
  cancelled: "grey",
};

export function AdStatusBadge({ status }: { status: AdStatus }) {
  const t = useTranslations("Billing");
  return <StatusBadge tone={AD_TONES[status]}>{t(`adStatus.${status}`)}</StatusBadge>;
}

/** Invoices of one member, or (admin) of everyone with the member column and actions. */
export function InvoiceTable({
  invoices,
  loading,
  error,
  admin = false,
  onChange,
}: {
  invoices: (Invoice | AdminInvoice)[];
  loading: boolean;
  error?: string;
  admin?: boolean;
  onChange?: () => void;
}) {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const money = useMoney();
  const date = useDate();
  const cols = admin ? 7 : 6;

  const run = async (action: typeof adminMarkInvoicePaidAction, id: string, confirmText: string, done: string) => {
    if (!window.confirm(confirmText)) return;
    const res = await action(id);
    if (res.ok) {
      toast.success(done);
      onChange?.();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-5 py-3 font-semibold">{t("invoice")}</th>
            {admin && <th className="px-5 py-3 font-semibold">{t("member")}</th>}
            <th className="px-5 py-3 font-semibold">{t("description")}</th>
            <th className="px-5 py-3 font-semibold">{t("dueDate")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("total")}</th>
            <th className="px-5 py-3 font-semibold">{tc("status")}</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <TableStatus colSpan={cols} loading={loading} error={error} empty={invoices.length === 0} emptyText={t("noInvoices")} />
          {!loading &&
            invoices.map((inv) => {
              const member = admin ? ((inv as AdminInvoice).hotel ?? (inv as AdminInvoice).supplier) : null;
              const memberHref = admin && (inv as AdminInvoice).hotel ? `/admin/hotels/${member?._id}` : `/admin/suppliers/${member?._id}`;
              return (
                <tr key={inv._id} className="align-top transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-900">{inv.number}</span>
                    <span className="block text-xs text-gray-500">
                      {t(`kind.${inv.kind}`)} · {date(inv.issuedAt)}
                    </span>
                  </td>
                  {admin && (
                    <td className="px-5 py-3">
                      {member ? (
                        <Link href={memberHref} className="font-medium text-gray-900 hover:text-primary-dark">
                          {member.name}
                          <span className="block text-xs font-normal text-gray-500">{member.memberNumber}</span>
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                  <td className="max-w-sm px-5 py-3 text-gray-700">
                    {inv.description}
                    {inv.periodStart && inv.periodEnd && (
                      <span className="block text-xs text-gray-500">
                        {date(inv.periodStart)} – {date(inv.periodEnd)}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-700">{inv.status === "paid" ? t("paidOn", { date: date(inv.paidAt) }) : date(inv.dueDate)}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <span className="font-medium text-gray-900">{money(inv.total)}</span>
                    <span className="block text-xs text-gray-500">{t("inclVat", { vat: money(inv.vat) })}</span>
                  </td>
                  <td className="px-5 py-3">
                    <InvoiceStatusBadge invoice={inv} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      {!admin && inv.status === "open" && inv.paymentUrl && (
                        <a href={inv.paymentUrl} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
                          <BiCreditCard size={14} /> {t("payNow")}
                        </a>
                      )}
                      {inv.moneybirdUrl && (
                        <a href={inv.moneybirdUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-dark">
                          <BiLinkExternal size={14} /> {t("viewInvoice")}
                        </a>
                      )}
                      {admin && inv.status === "open" && (
                        <>
                          <button
                            type="button"
                            onClick={() => run(adminMarkInvoicePaidAction, inv._id, t("confirmPaid", { number: inv.number }), t("markedPaid"))}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary-dark"
                          >
                            {t("markPaid")}
                          </button>
                          <button
                            type="button"
                            onClick={() => run(adminCancelInvoiceAction, inv._id, t("confirmCancel", { number: inv.number }), t("cancelled"))}
                            className="rounded-lg border border-ember-100 px-3 py-1.5 text-xs font-medium text-ember-600 hover:bg-ember-100"
                          >
                            {tc("cancel")}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
