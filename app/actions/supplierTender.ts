"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";
import type { Offer, Tender } from "./tender";

// Open Tenders of the signed-in supplier (its country + trades) and its quotes (briefing §4.5–4.6, Master Briefing v4).

export type InvitationStatus = "open" | "submitted" | "won" | "lost" | "expired" | "cancelled";

export interface Invitation extends Omit<Tender, "winner"> {
  hotel: { _id: string; name: string; city: string };
  /** The hotel's contact email for quotes (Master Briefing v4). */
  contactEmail: string;
  acceptingOffers: boolean;
  myStatus: InvitationStatus;
  myOffer: Omit<Offer, "supplier"> | null;
}

export async function listInvitationsAction(): Promise<ActionResponse<Invitation[]>> {
  return apiRequest<Invitation[]>("/supplier-tenders", { fallbackError: "Failed to load the requests." });
}

export async function getInvitationAction(id: string): Promise<ActionResponse<Invitation>> {
  return apiRequest<Invitation>(`/supplier-tenders/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this request." });
}

/** Sends or changes the quote. FormData: price, deliveryWeeks, notes, file (optional PDF/photo). */
export async function submitOfferAction(id: string, form: FormData): Promise<ActionResponse<Offer>> {
  return apiRequest<Offer>(`/supplier-tenders/${encodeURIComponent(id)}/offer`, { method: "PUT", body: form, fallbackError: "Failed to send the quote." });
}
