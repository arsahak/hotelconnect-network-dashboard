"use server";

import { apiRequest, type ActionResponse, type Page } from "@/lib/api";

// Corporate vouchers: deals from member hotels for supplier members.

export interface Voucher {
  _id: string;
  hotel: { _id: string; name: string; city: string; memberNumber: string };
  title: string;
  teaser: string;
  description: string;
  image: string;
  discountPercent: number;
  category: string;
  region: string;
  bookingUrl: string;
  isActive: boolean;
  /** Shown first in the website slideshow until this date. */
  promotedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherInput {
  hotel: string;
  title: string;
  teaser: string;
  description: string;
  discountPercent: number;
  category: string;
  bookingUrl: string;
  isActive: boolean;
  /** yyyy-mm-dd, or "" for no promotion. */
  promotedUntil: string;
}

export type VoucherListParams = { q?: string; category?: string; hotel?: string; active?: string; page?: number; limit?: number };

export async function listVouchersAction(params: VoucherListParams): Promise<ActionResponse<Page<Voucher>>> {
  return apiRequest<Page<Voucher>>("/vouchers/admin", { query: params, fallbackError: "Failed to load the vouchers." });
}

export async function getVoucherAction(id: string): Promise<ActionResponse<Voucher>> {
  return apiRequest<Voucher>(`/vouchers/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this voucher." });
}

export async function createVoucherAction(data: VoucherInput): Promise<ActionResponse<Voucher>> {
  return apiRequest<Voucher>("/vouchers/admin", { method: "POST", body: data, fallbackError: "Failed to add the voucher." });
}

export async function updateVoucherAction(id: string, data: Partial<VoucherInput>): Promise<ActionResponse<Voucher>> {
  return apiRequest<Voucher>(`/vouchers/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save the voucher.",
  });
}

export async function deleteVoucherAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/vouchers/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to delete the voucher.",
  });
}

export async function uploadVoucherImageAction(id: string, formData: FormData): Promise<ActionResponse<Voucher>> {
  return apiRequest<Voucher>(`/vouchers/admin/${encodeURIComponent(id)}/image`, {
    method: "PUT",
    body: formData,
    fallbackError: "Failed to upload the photo.",
  });
}

export async function deleteVoucherImageAction(id: string): Promise<ActionResponse<Voucher>> {
  return apiRequest<Voucher>(`/vouchers/admin/${encodeURIComponent(id)}/image`, {
    method: "DELETE",
    fallbackError: "Failed to remove the photo.",
  });
}
