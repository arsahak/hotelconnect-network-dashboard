"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Storingslijst of the signed-in hotel (briefing §3.4.3). Managers edit it;
// the staff login reads it and can report faults.

export interface FaultContact {
  _id: string;
  name: string;
  faultType: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type FaultContactInput = Omit<FaultContact, "_id" | "createdAt" | "updatedAt">;

export async function listFaultContactsAction(): Promise<ActionResponse<FaultContact[]>> {
  return apiRequest<FaultContact[]>("/fault-contacts", { fallbackError: "Failed to load the storingslijst." });
}

export async function getFaultContactAction(id: string): Promise<ActionResponse<FaultContact>> {
  return apiRequest<FaultContact>(`/fault-contacts/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this contact." });
}

export async function createFaultContactAction(data: FaultContactInput): Promise<ActionResponse<FaultContact>> {
  return apiRequest<FaultContact>("/fault-contacts", { method: "POST", body: data, fallbackError: "Failed to add the contact." });
}

export async function updateFaultContactAction(id: string, data: FaultContactInput): Promise<ActionResponse<FaultContact>> {
  return apiRequest<FaultContact>(`/fault-contacts/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the contact." });
}

export async function deleteFaultContactAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/fault-contacts/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the contact." });
}

/** Emails the party with the hotel's details. Nothing is stored. */
export async function reportFaultAction(
  id: string,
  data: { location: string; description: string; urgent: boolean },
): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/fault-contacts/${encodeURIComponent(id)}/report`, {
    method: "POST",
    body: data,
    fallbackError: "The fault could not be reported. Please call the party.",
  });
}
