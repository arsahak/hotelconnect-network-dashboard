"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The signed-in supplier's own profile (briefing §4.2, §4.7).

export interface Certificate {
  name: string;
  url: string;
}

export interface MySupplier {
  _id: string;
  memberNumber: string;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  /** Company bio, at most 500 characters (Master Briefing v4). */
  description: string;
  city: string;
  /** Country_Tag (ISO code). */
  country: string;
  categories: string[];
  regions: string[];
  website: string;
  isActive: boolean;
  contact: { person: string; email: string; phone: string };
  emails: { invoices: string; notifications: string };
  certificates: Certificate[];
}

export type MySupplierInput = Pick<MySupplier, "tagline" | "description" | "city" | "categories" | "regions" | "website" | "contact" | "emails" | "certificates">;

export async function getMySupplierAction(): Promise<ActionResponse<MySupplier>> {
  return apiRequest<MySupplier>("/my-supplier", { fallbackError: "Failed to load your profile." });
}

export async function updateMySupplierAction(data: MySupplierInput): Promise<ActionResponse<MySupplier>> {
  return apiRequest<MySupplier>("/my-supplier", { method: "PATCH", body: data, fallbackError: "Failed to save your profile." });
}

/** formData: { image: File } */
export async function uploadMyLogoAction(form: FormData): Promise<ActionResponse<MySupplier>> {
  return apiRequest<MySupplier>("/my-supplier/logo", { method: "PUT", body: form, fallbackError: "Failed to upload the logo." });
}

export async function deleteMyLogoAction(): Promise<ActionResponse<MySupplier>> {
  return apiRequest<MySupplier>("/my-supplier/logo", { method: "DELETE", fallbackError: "Failed to remove the logo." });
}

/** My Partner Hotels (Master Briefing v4): hotels that sent a 1-click invite. */
export interface PartnerHotel {
  _id: string;
  hotel: { _id: string; name: string; slug: string; city: string; image: string };
  since: string;
}

export async function listPartnerHotelsAction(): Promise<ActionResponse<PartnerHotel[]>> {
  return apiRequest<PartnerHotel[]>("/my-supplier/partners", { fallbackError: "Failed to load your partner hotels." });
}
