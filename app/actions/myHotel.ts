"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";
import type { HotelEmails } from "./hotel";

// The signed-in hotel (hotel managers; the staff login can read the basics).

export type EmailType = "general" | "invoices" | "vacancies" | "faults" | "alerts";
export type NotificationType = "compliance" | "tender" | "vacancy" | "fault" | "system" | "advertising";
export type NotificationChannel = "both" | "dashboard" | "email";

export interface Facilities {
  rooms?: number | null;
  restaurant: boolean;
  lift: boolean;
  pool: boolean;
  parking: boolean;
}

export interface MyHotel {
  _id: string;
  memberNumber: string;
  name: string;
  slug: string;
  kvkNumber: string;
  address: string;
  city: string;
  region: string;
  contactPerson: string;
  phone: string;
  description: string;
  image: string;
  bookingUrl: string;
  offer: string;
  isActive: boolean;
  emails: HotelEmails;
  notify: Record<EmailType, boolean>;
  notificationChannels?: Record<NotificationType, NotificationChannel>;
  notificationPush?: Record<NotificationType, boolean>;
  facilities: Facilities;
  onboarding: { step: number; completedAt: string | null };
  updatedAt?: string;
  /** Permits that hotels like this one usually need (keys, see messages → Compliance). */
  compliance: { permits: string[] };
}

export type MyHotelInput = Partial<
  Pick<MyHotel, "name" | "kvkNumber" | "address" | "city" | "region" | "contactPerson" | "phone" | "description" | "bookingUrl" | "offer">
> & {
  emails?: Partial<HotelEmails>;
  notify?: Partial<Record<EmailType, boolean>>;
  notificationChannels?: Partial<Record<NotificationType, NotificationChannel>>;
  notificationPush?: Partial<Record<NotificationType, boolean>>;
  facilities?: Partial<Facilities>;
};

export async function getMyHotelAction(): Promise<ActionResponse<MyHotel>> {
  return apiRequest<MyHotel>("/my-hotel", { fallbackError: "Failed to load your hotel." });
}

export async function updateMyHotelAction(data: MyHotelInput): Promise<ActionResponse<MyHotel>> {
  return apiRequest<MyHotel>("/my-hotel", { method: "PATCH", body: data, fallbackError: "Failed to save your hotel." });
}

export async function uploadMyHotelImageAction(formData: FormData): Promise<ActionResponse<MyHotel>> {
  return apiRequest<MyHotel>("/my-hotel/image", { method: "PUT", body: formData, fallbackError: "Failed to upload the photo." });
}

export async function deleteMyHotelImageAction(): Promise<ActionResponse<MyHotel>> {
  return apiRequest<MyHotel>("/my-hotel/image", { method: "DELETE", fallbackError: "Failed to remove the photo." });
}

// ── Onboarding ───────────────────────────────────────────────────────────────

export async function saveOnboardingStepAction(step: number): Promise<ActionResponse<MyHotel["onboarding"]>> {
  return apiRequest("/my-hotel/onboarding", { method: "PATCH", body: { step }, fallbackError: "Failed to save your progress." });
}

export async function completeOnboardingAction(): Promise<ActionResponse<MyHotel["onboarding"]>> {
  return apiRequest("/my-hotel/onboarding/complete", { method: "POST", fallbackError: "Failed to confirm." });
}

// ── Year calendar ────────────────────────────────────────────────────────────

export type CalendarKind = "contract_end" | "notice_deadline" | "permit_expiry";

export interface CalendarEvent {
  date: string;
  kind: CalendarKind;
  title: string;
  subtitle?: string;
  refType: "contract" | "permit";
  refId: string;
}

export interface Calendar {
  from: string;
  to: string;
  events: CalendarEvent[];
  overdue: CalendarEvent[];
  summary: { contracts: number; permits: number; faultContacts: number; costPerYear: number | null };
}

export async function getCalendarAction(): Promise<ActionResponse<Calendar>> {
  return apiRequest<Calendar>("/my-hotel/calendar", { fallbackError: "Failed to load the calendar." });
}

// ── Staff login ──────────────────────────────────────────────────────────────

export interface StaffLogin {
  email: string;
  isActive: boolean;
  updatedAt: string;
}

export async function getStaffLoginAction(): Promise<ActionResponse<StaffLogin | null>> {
  return apiRequest<StaffLogin | null>("/my-hotel/staff-login", { fallbackError: "Failed to load the staff login." });
}

export async function saveStaffLoginAction(data: { email: string; password?: string }): Promise<ActionResponse<StaffLogin>> {
  return apiRequest<StaffLogin>("/my-hotel/staff-login", { method: "PUT", body: data, fallbackError: "Failed to save the staff login." });
}

export async function deleteStaffLoginAction(): Promise<ActionResponse<null>> {
  return apiRequest<null>("/my-hotel/staff-login", { method: "DELETE", fallbackError: "Failed to remove the staff login." });
}
