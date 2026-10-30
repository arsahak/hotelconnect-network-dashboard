"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Collectieve inkoop (briefing §3.13).

export type PurchaseStatus = "open" | "negotiating" | "completed";

export interface PurchaseAction {
  _id: string;
  title: string;
  category: string;
  description: string;
  status: PurchaseStatus;
  targetParticipants: number;
  deadline: string;
  expectedSavings: string;
  completedAt: string | null;
  filesDeletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  participants: number;
}

export interface Participation {
  _id: string;
  currentSupplier: string;
  contractEndDate: string;
  annualUsage: string;
  invoice: { name: string; size: number } | null;
  createdAt: string;
}

export interface HotelPurchaseAction extends PurchaseAction {
  joinable: boolean;
  myParticipation: Participation | null;
}

export interface AdminPurchaseAction extends Omit<PurchaseAction, "participants"> {
  participants: (Participation & { hotel: { _id: string; name: string; memberNumber: string; city: string } })[];
}

export interface PurchaseActionInput {
  title: string;
  category: string;
  description: string;
  deadline: string;
  expectedSavings: string;
  targetParticipants: number;
  status: PurchaseStatus;
}

// ── Hotel managers ──

export async function listPurchaseActionsAction(): Promise<ActionResponse<HotelPurchaseAction[]>> {
  return apiRequest<HotelPurchaseAction[]>("/purchasing", { fallbackError: "Failed to load the collective purchases." });
}

/** FormData: currentSupplier, contractEndDate, annualUsage, invoice (PDF). */
export async function joinPurchaseActionAction(id: string, form: FormData): Promise<ActionResponse<Participation>> {
  return apiRequest<Participation>(`/purchasing/${encodeURIComponent(id)}/join`, { method: "POST", body: form, fallbackError: "Failed to sign up." });
}

export async function withdrawPurchaseActionAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/purchasing/${encodeURIComponent(id)}/join`, { method: "DELETE", fallbackError: "Failed to withdraw." });
}

// ── Admins ──

export async function adminListPurchaseActionsAction(): Promise<ActionResponse<PurchaseAction[]>> {
  return apiRequest<PurchaseAction[]>("/purchasing/admin", { fallbackError: "Failed to load the collective purchases." });
}

export async function adminGetPurchaseActionAction(id: string): Promise<ActionResponse<AdminPurchaseAction>> {
  return apiRequest<AdminPurchaseAction>(`/purchasing/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this action." });
}

export async function adminCreatePurchaseActionAction(data: PurchaseActionInput): Promise<ActionResponse<PurchaseAction>> {
  return apiRequest<PurchaseAction>("/purchasing/admin", { method: "POST", body: data, fallbackError: "Failed to create the action." });
}

export async function adminUpdatePurchaseActionAction(id: string, data: Partial<PurchaseActionInput>): Promise<ActionResponse<PurchaseAction>> {
  return apiRequest<PurchaseAction>(`/purchasing/admin/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the action." });
}

export async function adminDeletePurchaseActionAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/purchasing/admin/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the action." });
}
