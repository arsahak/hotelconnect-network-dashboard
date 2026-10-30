"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Sign-ups (briefing §3.1, §4.1) and the test phase switch (§1, §9). Admins.

export type RegistrationStatus = "pending" | "approved" | "rejected";

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
  address: string;
  city: string;
  region: string;
  categories: string[];
  regions: string[];
  plan: "contract" | "commission";
  website: string;
  member: string | null;
  rejectionReason: string;
  decidedAt: string | null;
  createdAt: string;
}

export async function getSettingsAction(): Promise<ActionResponse<{ testPhase: boolean }>> {
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

export async function approveRegistrationAction(id: string): Promise<ActionResponse<{ memberNumber: string; member: string }>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}/approve`, { method: "POST", fallbackError: "Failed to approve." });
}

export async function rejectRegistrationAction(id: string, reason: string): Promise<ActionResponse<Registration>> {
  return apiRequest(`/registrations/admin/${encodeURIComponent(id)}/reject`, { method: "POST", body: { reason }, fallbackError: "Failed to reject." });
}
