"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// A hotel's trusted suppliers (Master Briefing v4: 1-click invite).

export interface Partner {
  _id: string;
  company: string;
  email: string;
  contract: string | null;
  status: "invited" | "active";
  supplier: { _id: string; name: string; slug: string; logo: string; memberNumber: string } | null;
  invitedAt: string;
  acceptedAt: string | null;
}

export async function listPartnersAction(): Promise<ActionResponse<Partner[]>> {
  return apiRequest<Partner[]>("/my-hotel/partners", { fallbackError: "Failed to load your partners." });
}

/** From a contract (company + email come from it), or by email. */
export async function invitePartnerAction(data: { contract?: string; email?: string; company?: string }): Promise<ActionResponse<Partner>> {
  return apiRequest<Partner>("/my-hotel/partners/invite", { method: "POST", body: data, fallbackError: "Failed to send the invite." });
}
