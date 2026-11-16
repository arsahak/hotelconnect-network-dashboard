"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Staff accounts of the signed-in hotel (Master Briefing v4).

export type HotelUserRole = "gm" | "dept_manager" | "staff" | "shared";
export type Department = "HSK" | "TD" | "FO" | "FB";
export type Language = "en" | "nl" | "fr";

export interface StaffAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "hotel_manager" | "hotel_staff";
  hotelRole: HotelUserRole;
  department: Department | "" | null;
  language: Language | null;
  isActive: boolean;
  createdAt: string;
}

export type StaffInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hotelRole: Exclude<HotelUserRole, "shared">;
  department: Department | "";
  language: Language | "";
};

export async function listStaffAction(): Promise<ActionResponse<StaffAccount[]>> {
  return apiRequest<StaffAccount[]>("/my-hotel/staff", { fallbackError: "Failed to load the staff accounts." });
}

export async function createStaffAction(data: StaffInput): Promise<ActionResponse<StaffAccount>> {
  return apiRequest<StaffAccount>("/my-hotel/staff", { method: "POST", body: data, fallbackError: "Failed to create the account." });
}

export async function updateStaffAction(
  id: string,
  data: Partial<Omit<StaffInput, "email">> & { isActive?: boolean },
): Promise<ActionResponse<StaffAccount>> {
  return apiRequest<StaffAccount>(`/my-hotel/staff/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the account." });
}

export async function deleteStaffAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/my-hotel/staff/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the account." });
}
