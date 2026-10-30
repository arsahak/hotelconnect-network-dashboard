"use server";

import { apiRequest, type ActionResponse, type Page } from "@/lib/api";

// Member hotels (H0001…). Managed by admins; every hotel gets a member
// number from the API when it is added.

export interface HotelEmails {
  general: string;
  invoices?: string;
  vacancies?: string;
  faults?: string;
  alerts?: string;
}

export interface Hotel {
  _id: string;
  memberNumber: string;
  name: string;
  slug: string;
  city: string;
  region: string;
  address: string;
  description: string;
  image: string;
  bookingUrl: string;
  offer: string;
  featured: boolean;
  isActive: boolean;
  emails: HotelEmails;
  createdAt: string;
  updatedAt: string;
  /** Only on the details call. */
  counts?: { vacancies: number; vouchers: number };
}

export interface HotelInput {
  name: string;
  city: string;
  region: string;
  address: string;
  description: string;
  bookingUrl: string;
  offer: string;
  featured: boolean;
  isActive: boolean;
  emails: HotelEmails;
}

export interface HotelOption {
  _id: string;
  name: string;
  city: string;
  memberNumber: string;
  isActive: boolean;
  emails: HotelEmails;
}

export type HotelListParams = { q?: string; region?: string; active?: string; page?: number; limit?: number };

export async function listHotelsAction(params: HotelListParams): Promise<ActionResponse<Page<Hotel>>> {
  return apiRequest<Page<Hotel>>("/hotels/admin", { query: params, fallbackError: "Failed to load the hotels." });
}

/** Every hotel, for dropdowns (jobs, vouchers). */
export async function hotelOptionsAction(): Promise<ActionResponse<HotelOption[]>> {
  return apiRequest<HotelOption[]>("/hotels/admin/options", { fallbackError: "Failed to load the hotels." });
}

export async function getHotelAction(id: string): Promise<ActionResponse<Hotel>> {
  return apiRequest<Hotel>(`/hotels/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this hotel." });
}

export async function createHotelAction(data: HotelInput): Promise<ActionResponse<Hotel>> {
  return apiRequest<Hotel>("/hotels/admin", { method: "POST", body: data, fallbackError: "Failed to add the hotel." });
}

export async function updateHotelAction(id: string, data: Partial<HotelInput>): Promise<ActionResponse<Hotel>> {
  return apiRequest<Hotel>(`/hotels/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save the hotel.",
  });
}

export async function deleteHotelAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/hotels/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to delete the hotel.",
  });
}

/** formData: { image: File } */
export async function uploadHotelImageAction(id: string, formData: FormData): Promise<ActionResponse<Hotel>> {
  return apiRequest<Hotel>(`/hotels/admin/${encodeURIComponent(id)}/image`, {
    method: "PUT",
    body: formData,
    fallbackError: "Failed to upload the photo.",
  });
}

export async function deleteHotelImageAction(id: string): Promise<ActionResponse<Hotel>> {
  return apiRequest<Hotel>(`/hotels/admin/${encodeURIComponent(id)}/image`, {
    method: "DELETE",
    fallbackError: "Failed to remove the photo.",
  });
}

// ── The hotel's logins (admins) ──────────────────────────────────────────────

export interface HotelUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "hotel_manager" | "hotel_staff";
  isActive: boolean;
  createdAt: string;
}

export async function listHotelUsersAction(hotelId: string): Promise<ActionResponse<HotelUser[]>> {
  return apiRequest<HotelUser[]>(`/hotels/admin/${encodeURIComponent(hotelId)}/users`, { fallbackError: "Failed to load the logins." });
}

export async function createHotelManagerAction(
  hotelId: string,
  data: { firstName: string; lastName: string; email: string; password: string },
): Promise<ActionResponse<HotelUser>> {
  return apiRequest<HotelUser>(`/hotels/admin/${encodeURIComponent(hotelId)}/users`, {
    method: "POST",
    body: data,
    fallbackError: "Failed to create the login.",
  });
}

export async function deleteHotelUserAction(hotelId: string, userId: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/hotels/admin/${encodeURIComponent(hotelId)}/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
    fallbackError: "Failed to remove the login.",
  });
}
