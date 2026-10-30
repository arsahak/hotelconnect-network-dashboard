"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Handige links & portalen of the signed-in hotel (briefing §3.11). Never a password.

export interface PortalLink {
  _id: string;
  category: string;
  /** Only for category "Other". */
  customCategory: string;
  name: string;
  url: string;
  username: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type PortalLinkInput = Pick<PortalLink, "category" | "customCategory" | "name" | "url" | "username" | "notes">;

export async function listPortalLinksAction(params: { q?: string }): Promise<ActionResponse<PortalLink[]>> {
  return apiRequest<PortalLink[]>("/portal-links", { query: params, fallbackError: "Failed to load the links." });
}

export async function getPortalLinkAction(id: string): Promise<ActionResponse<PortalLink>> {
  return apiRequest<PortalLink>(`/portal-links/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this link." });
}

export async function createPortalLinkAction(data: PortalLinkInput): Promise<ActionResponse<PortalLink>> {
  return apiRequest<PortalLink>("/portal-links", { method: "POST", body: data, fallbackError: "Failed to add the link." });
}

export async function updatePortalLinkAction(id: string, data: PortalLinkInput): Promise<ActionResponse<PortalLink>> {
  return apiRequest<PortalLink>(`/portal-links/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the link." });
}

export async function deletePortalLinkAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/portal-links/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the link." });
}
