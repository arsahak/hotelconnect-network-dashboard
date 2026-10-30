"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Permits and certificates of the signed-in hotel (briefing §3.4.4).

export interface Permit {
  _id: string;
  type: string;
  authority: string;
  issueDate: string | null;
  expiryDate: string | null;
  documentLink: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Form values: dates as yyyy-mm-dd ("" = empty). */
export interface PermitInput {
  type: string;
  authority: string;
  issueDate: string;
  expiryDate: string;
  documentLink: string;
  notes: string;
}

export interface PermitList {
  items: Permit[];
  /** Keys of permits hotels like this one usually need. */
  suggestions: string[];
}

export async function listPermitsAction(params: { q?: string }): Promise<ActionResponse<PermitList>> {
  return apiRequest<PermitList>("/permits", { query: params, fallbackError: "Failed to load the permits." });
}

export async function getPermitAction(id: string): Promise<ActionResponse<Permit>> {
  return apiRequest<Permit>(`/permits/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this permit." });
}

export async function createPermitAction(data: PermitInput): Promise<ActionResponse<Permit>> {
  return apiRequest<Permit>("/permits", { method: "POST", body: data, fallbackError: "Failed to add the permit." });
}

export async function updatePermitAction(id: string, data: PermitInput): Promise<ActionResponse<Permit>> {
  return apiRequest<Permit>(`/permits/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the permit." });
}

export async function deletePermitAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/permits/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the permit." });
}
