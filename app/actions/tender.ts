"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Tenders of the signed-in hotel (briefing §3.5).

export type TenderStatus = "open" | "awarded" | "cancelled";
export type OfferStatus = "submitted" | "won" | "lost";

export interface TenderSupplier {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  memberNumber: string;
}

export interface Offer {
  _id: string;
  supplier: TenderSupplier;
  price: number;
  deliveryTime: string;
  notes: string;
  file: { url: string; name: string } | null;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Tender {
  _id: string;
  type: string;
  title: string;
  category: string;
  region: string;
  description: string;
  deadline: string;
  budget: number | null;
  status: TenderStatus;
  winner: string | null;
  awardedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenderListItem extends Tender {
  invitedCount: number;
  offerCount: number;
}

/** Kwaliteitsformulier (briefing §3.8). */
export interface Review {
  rating: number;
  communication: number;
  onTime: boolean;
  wouldHireAgain: boolean;
  comments: string;
  updatedAt: string;
}

export type ReviewInput = Omit<Review, "updatedAt">;

export interface TenderDetail extends Tender {
  invitedSuppliers: TenderSupplier[];
  offers: Offer[];
  review: Review | null;
}

/** Form values: deadline as yyyy-mm-dd, budget as text ("" = none). */
export interface TenderInput {
  type: string;
  title: string;
  category: string;
  region: string;
  description: string;
  deadline: string;
  budget: string;
}

export async function listTendersAction(params: { q?: string }): Promise<ActionResponse<TenderListItem[]>> {
  return apiRequest<TenderListItem[]>("/tenders", { query: params, fallbackError: "Failed to load the tenders." });
}

export async function getTenderAction(id: string): Promise<ActionResponse<TenderDetail>> {
  return apiRequest<TenderDetail>(`/tenders/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this tender." });
}

export async function createTenderAction(data: TenderInput): Promise<ActionResponse<TenderListItem>> {
  return apiRequest<TenderListItem>("/tenders", { method: "POST", body: data, fallbackError: "Failed to send the tender." });
}

export async function updateTenderAction(
  id: string,
  data: Pick<TenderInput, "title" | "description" | "deadline" | "budget">,
): Promise<ActionResponse<Tender>> {
  return apiRequest<Tender>(`/tenders/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the tender." });
}

export async function awardTenderAction(id: string, offerId: string): Promise<ActionResponse<Tender>> {
  return apiRequest<Tender>(`/tenders/${encodeURIComponent(id)}/award`, { method: "POST", body: { offerId }, fallbackError: "Failed to choose the winner." });
}

export async function cancelTenderAction(id: string): Promise<ActionResponse<Tender>> {
  return apiRequest<Tender>(`/tenders/${encodeURIComponent(id)}/cancel`, { method: "POST", fallbackError: "Failed to cancel the tender." });
}

/** Rates the chosen supplier once the job is done; can be changed later. */
export async function reviewTenderAction(id: string, data: ReviewInput): Promise<ActionResponse<Review>> {
  return apiRequest<Review>(`/tenders/${encodeURIComponent(id)}/review`, { method: "PUT", body: data, fallbackError: "Failed to save the review." });
}
