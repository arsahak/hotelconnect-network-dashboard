"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The signed-in hotel's own corporate vouchers (briefing §3.10). Public straight away.

export interface MyVoucher {
  _id: string;
  title: string;
  teaser: string;
  description: string;
  image: string;
  discountPercent: number;
  category: string;
  region: string;
  bookingUrl: string;
  isActive: boolean;
  promotedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MyVoucherInput = Pick<MyVoucher, "title" | "teaser" | "description" | "discountPercent" | "category" | "bookingUrl" | "isActive">;

export async function listMyVouchersAction(): Promise<ActionResponse<MyVoucher[]>> {
  return apiRequest<MyVoucher[]>("/my-vouchers", { fallbackError: "Failed to load your vouchers." });
}

export async function getMyVoucherAction(id: string): Promise<ActionResponse<MyVoucher>> {
  return apiRequest<MyVoucher>(`/my-vouchers/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this voucher." });
}

export async function createMyVoucherAction(data: MyVoucherInput): Promise<ActionResponse<MyVoucher>> {
  return apiRequest<MyVoucher>("/my-vouchers", { method: "POST", body: data, fallbackError: "Failed to save the voucher." });
}

export async function updateMyVoucherAction(id: string, data: Partial<MyVoucherInput>): Promise<ActionResponse<MyVoucher>> {
  return apiRequest<MyVoucher>(`/my-vouchers/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the voucher." });
}

export async function deleteMyVoucherAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/my-vouchers/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the voucher." });
}

/** formData: { image: File } */
export async function uploadMyVoucherImageAction(id: string, form: FormData): Promise<ActionResponse<MyVoucher>> {
  return apiRequest<MyVoucher>(`/my-vouchers/${encodeURIComponent(id)}/image`, { method: "PUT", body: form, fallbackError: "Failed to upload the photo." });
}

export async function deleteMyVoucherImageAction(id: string): Promise<ActionResponse<MyVoucher>> {
  return apiRequest<MyVoucher>(`/my-vouchers/${encodeURIComponent(id)}/image`, { method: "DELETE", fallbackError: "Failed to remove the photo." });
}
