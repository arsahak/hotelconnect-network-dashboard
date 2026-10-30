"use server";

import { apiRequest, type ActionResponse, type Page } from "@/lib/api";
import type { AccountLogin } from "@/components/shared/LoginsCard";

// Suppliers (L001…). Free in phase 1. The directory profile is public on
// the website; contact details are only for members and admins.

/** From the hotels' quality forms (briefing §3.8). score drives the ranking. */
export interface SupplierRating {
  average: number;
  count: number;
  score: number;
}

export interface SupplierContact {
  person?: string;
  email: string;
  phone?: string;
}

export interface Supplier {
  plan?: "contract" | "commission";
  kvkNumber?: string;
  rating?: SupplierRating;
  _id: string;
  memberNumber: string;
  name: string;
  slug: string;
  logo: string;
  image: string;
  tagline: string;
  description: string;
  categories: string[];
  regions: string[];
  website: string;
  featured: boolean;
  showInPurchasing: boolean;
  isActive: boolean;
  contact: SupplierContact;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInput {
  name: string;
  tagline: string;
  description: string;
  categories: string[];
  regions: string[];
  website: string;
  /** Briefing §4.10: maintenance contract (€49/month, €539/year) or commission only. */
  plan: "contract" | "commission";
  kvkNumber: string;
  featured: boolean;
  showInPurchasing: boolean;
  isActive: boolean;
  contact: SupplierContact;
}

export type SupplierPicture = "logo" | "image";
export type SupplierListParams = { q?: string; category?: string; active?: string; page?: number; limit?: number };

export async function listSuppliersAction(params: SupplierListParams): Promise<ActionResponse<Page<Supplier>>> {
  return apiRequest<Page<Supplier>>("/suppliers/admin", { query: params, fallbackError: "Failed to load the suppliers." });
}

export async function getSupplierAction(id: string): Promise<ActionResponse<Supplier>> {
  return apiRequest<Supplier>(`/suppliers/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this supplier." });
}

export async function createSupplierAction(data: SupplierInput): Promise<ActionResponse<Supplier>> {
  return apiRequest<Supplier>("/suppliers/admin", { method: "POST", body: data, fallbackError: "Failed to add the supplier." });
}

export async function updateSupplierAction(id: string, data: Partial<SupplierInput>): Promise<ActionResponse<Supplier>> {
  return apiRequest<Supplier>(`/suppliers/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save the supplier.",
  });
}

export async function deleteSupplierAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/suppliers/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to delete the supplier.",
  });
}

/** The logo or the large photo. formData: { image: File } */
export async function uploadSupplierPictureAction(
  id: string,
  picture: SupplierPicture,
  formData: FormData,
): Promise<ActionResponse<Supplier>> {
  return apiRequest<Supplier>(`/suppliers/admin/${encodeURIComponent(id)}/${picture === "logo" ? "logo" : "image"}`, {
    method: "PUT",
    body: formData,
    fallbackError: "Failed to upload the picture.",
  });
}

export async function deleteSupplierPictureAction(id: string, picture: SupplierPicture): Promise<ActionResponse<Supplier>> {
  return apiRequest<Supplier>(`/suppliers/admin/${encodeURIComponent(id)}/${picture === "logo" ? "logo" : "image"}`, {
    method: "DELETE",
    fallbackError: "Failed to remove the picture.",
  });
}

// ── The supplier's logins (admins) ───────────────────────────────────────────
// With this login the supplier uses the dashboard and books vouchers on the website.

export async function listSupplierUsersAction(supplierId: string): Promise<ActionResponse<AccountLogin[]>> {
  return apiRequest<AccountLogin[]>(`/suppliers/admin/${encodeURIComponent(supplierId)}/users`, { fallbackError: "Failed to load the logins." });
}

export async function createSupplierLoginAction(
  supplierId: string,
  data: { firstName: string; lastName: string; email: string; password: string },
): Promise<ActionResponse<AccountLogin>> {
  return apiRequest<AccountLogin>(`/suppliers/admin/${encodeURIComponent(supplierId)}/users`, {
    method: "POST",
    body: data,
    fallbackError: "Failed to create the login.",
  });
}

export async function deleteSupplierUserAction(supplierId: string, userId: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/suppliers/admin/${encodeURIComponent(supplierId)}/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    fallbackError: "Failed to remove the login.",
  });
}
