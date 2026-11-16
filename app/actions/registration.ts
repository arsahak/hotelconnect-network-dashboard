"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Sign-ups (briefing §3.1, §4.1) and the test phase switch (§1, §9). Admins.

export type RegistrationStatus = "pending" | "waiting" | "approved" | "rejected";

export interface Registration {
  _id: string;
  type: "hotel" | "supplier";
  status: RegistrationStatus;
  companyName: string;
  kvkNumber: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  /** Country_Tag (ISO code). */
  country: string;
  termsAcceptedAt: string | null;
  legalName: string;
  vatNumber: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  rooms: number | null;
  billingEmail: string;
  bookingUrl: string;
  categories: string[];
  regions: string[];
  plan: "contract" | "commission";
  website: string;
  member: string | null;
  rejectionReason: string;
  /** Questions an admin emailed while checking. */
  messages: { text: string; sentAt: string }[];
  decidedAt: string | null;
  createdAt: string;
}

/** Phase 2 features (Master Briefing v4), hidden until an admin switches them on. */
export type FeatureKey = "vouchers" | "advertising" | "reviews";
export type Features = Record<FeatureKey, boolean>;

export async function updateFeaturesAction(features: Partial<Features>): Promise<ActionResponse<{ testPhase: boolean; features: Features }>> {
  return apiRequest("/settings", { method: "PATCH", body: { features }, fallbackError: "Failed to save the setting." });
}

export async function getSettingsAction(): Promise<ActionResponse<{ testPhase: boolean; features: Features }>> {
  return apiRequest("/settings", { fallbackError: "Failed to load the settings." });
}

export async function updateSettingsAction(testPhase: boolean): Promise<ActionResponse<{ testPhase: boolean }>> {
  return apiRequest("/settings", { method: "PATCH", body: { testPhase }, fallbackError: "Failed to save the setting." });
}

export async function listRegistrationsAction(params: { status?: string }): Promise<ActionResponse<{ items: Registration[]; pending: number }>> {
  return apiRequest("/registrations/admin", { query: params, fallbackError: "Failed to load the registrations." });
}

export async function getRegistrationAction(id: string): Promise<ActionResponse<Registration>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this registration." });
}

export async function approveRegistrationAction(id: string, plan?: "contract" | "commission"): Promise<ActionResponse<{ memberNumber: string; member: string }>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}/approve`, { method: "POST", body: plan ? { plan } : {}, fallbackError: "Failed to approve." });
}

/** Emails the applicant a question; the registration then waits for the answer. */
export async function askRegistrationAction(id: string, message: string): Promise<ActionResponse<unknown>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}/ask`, { method: "POST", body: { message }, fallbackError: "Failed to send the question." });
}

export async function rejectRegistrationAction(id: string, reason: string): Promise<ActionResponse<Registration>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}/reject`, { method: "POST", body: { reason }, fallbackError: "Failed to reject." });
}
