"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Memberships, invoices (Facturen, briefing §3.9), sponsored homepage spots
// (§2.1, §3.15, §4.9) and voucher promotion (§3.10). Amounts are in cents.

export type InvoiceKind = "membership" | "commission" | "advertising" | "promotion";
export type InvoiceStatus = "open" | "paid" | "cancelled";
export type BillingInterval = "month" | "year";
export type AdBlock = "suppliers" | "jobs" | "hotels";
export type AdPeriod = "month" | "quarter";
export type AdStatus = "pending_payment" | "queued" | "live" | "ended" | "cancelled";

type MemberRef = { _id: string; name: string; memberNumber: string } | null;

export interface Invoice {
  _id: string;
  number: string;
  kind: InvoiceKind;
  description: string;
  lines: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  vat: number;
  total: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paymentUrl: string;
  moneybirdUrl: string;
}

export interface AdminInvoice extends Invoice {
  hotel: MemberRef;
  supplier: MemberRef;
}

export interface Subscription {
  _id: string;
  plan: "hotel" | "supplier-contract";
  interval: BillingInterval;
  status: "active" | "cancelled";
  startedAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
}

export interface Prices {
  subscriptions: { hotel: { year: number }; "supplier-contract": { month: number; year: number } };
  commissionPercent: number;
  vatRate: number;
  ads: Record<AdPeriod, number>;
  promotions: Record<AdPeriod, number>;
}

export interface MyBilling {
  subscription: Subscription | null;
  invoices: Invoice[];
  /** Suppliers only: "contract" pays a membership, otherwise commission per won job. */
  plan: string | null;
  prices: Prices;
  online: { mollie: boolean; moneybird: boolean };
}

export interface AdAvailability {
  block: AdBlock;
  prices: Record<AdPeriod, number>;
  positions: { position: number; liveUntil: string | null; waiting: number; nextStart: string }[];
}

export interface AdBooking {
  _id: string;
  block: AdBlock;
  position: number;
  period: AdPeriod;
  status: AdStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  vacancy: { _id: string; title: string } | null;
  invoice: { _id: string; number: string; total: number; status: InvoiceStatus; paymentUrl?: string } | null;
}

export interface AdminAdBooking extends AdBooking {
  hotel: MemberRef;
  supplier: MemberRef;
}

type Checkout = { invoice: { _id: string; number: string; total: number; paymentUrl: string } };

// ── Hotel managers and suppliers ──

export async function myBillingAction(): Promise<ActionResponse<MyBilling>> {
  return apiRequest<MyBilling>("/billing/mine", { fallbackError: "Failed to load your invoices." });
}

export async function changeIntervalAction(interval: BillingInterval): Promise<ActionResponse<Subscription>> {
  return apiRequest<Subscription>("/billing/mine/interval", { method: "PATCH", body: { interval }, fallbackError: "Failed to save." });
}

export async function adAvailabilityAction(): Promise<ActionResponse<AdAvailability[]>> {
  return apiRequest<AdAvailability[]>("/ads/availability", { fallbackError: "Failed to load the ad spots." });
}

export async function myAdBookingsAction(): Promise<ActionResponse<AdBooking[]>> {
  return apiRequest<AdBooking[]>("/ads/mine", { fallbackError: "Failed to load your bookings." });
}

export async function bookAdAction(data: { block: AdBlock; position: number; period: AdPeriod; vacancy?: string }): Promise<ActionResponse<Checkout & { booking: AdBooking }>> {
  return apiRequest("/ads", { method: "POST", body: data, fallbackError: "Failed to book this spot." });
}

export async function cancelAdBookingAction(id: string): Promise<ActionResponse<AdBooking>> {
  return apiRequest<AdBooking>(`/ads/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to cancel." });
}

export async function promoteVoucherAction(id: string, period: AdPeriod): Promise<ActionResponse<Checkout>> {
  return apiRequest<Checkout>(`/my-vouchers/${encodeURIComponent(id)}/promote`, { method: "POST", body: { period }, fallbackError: "Failed to start the promotion." });
}

// ── Admins ──

export async function adminInvoicesAction(filter: { status?: string; kind?: string }): Promise<
  ActionResponse<{ items: AdminInvoice[]; totals: { _id: InvoiceStatus; total: number; count: number }[] }>
> {
  const query = new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]).toString();
  return apiRequest(`/billing/admin/invoices${query ? `?${query}` : ""}`, { fallbackError: "Failed to load the invoices." });
}

export async function adminMarkInvoicePaidAction(id: string): Promise<ActionResponse<Invoice>> {
  return apiRequest<Invoice>(`/billing/admin/invoices/${encodeURIComponent(id)}/paid`, { method: "POST", fallbackError: "Failed to mark as paid." });
}

export async function adminCancelInvoiceAction(id: string): Promise<ActionResponse<Invoice>> {
  return apiRequest<Invoice>(`/billing/admin/invoices/${encodeURIComponent(id)}/cancel`, { method: "POST", fallbackError: "Failed to cancel the invoice." });
}

export async function adminMemberBillingAction(owner: { hotel?: string; supplier?: string }): Promise<ActionResponse<{ subscription: Subscription | null; invoices: Invoice[] }>> {
  const query = owner.hotel ? `hotel=${encodeURIComponent(owner.hotel)}` : `supplier=${encodeURIComponent(owner.supplier ?? "")}`;
  return apiRequest(`/billing/admin/member?${query}`, { fallbackError: "Failed to load the billing." });
}

export async function adminStartSubscriptionAction(owner: { hotel?: string; supplier?: string }): Promise<ActionResponse<Subscription>> {
  return apiRequest<Subscription>("/billing/admin/subscriptions", { method: "POST", body: owner, fallbackError: "Failed to start the membership." });
}

export async function adminCancelSubscriptionAction(id: string): Promise<ActionResponse<Subscription>> {
  return apiRequest<Subscription>(`/billing/admin/subscriptions/${encodeURIComponent(id)}/cancel`, { method: "POST", fallbackError: "Failed to stop the membership." });
}

export async function adminAdBookingsAction(): Promise<ActionResponse<AdminAdBooking[]>> {
  return apiRequest<AdminAdBooking[]>("/ads/admin", { fallbackError: "Failed to load the bookings." });
}
