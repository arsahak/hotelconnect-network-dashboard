"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Contract register of the signed-in hotel (briefing §3.4.1). All fields optional.

export type NoticeUnit = "days" | "weeks" | "months";

export interface Contract {
  _id: string;
  contractFor: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  duration: string;
  autoRenew: boolean;
  noticePeriod: { value: number | null; unit: NoticeUnit };
  /** Last day to cancel (only with automatic renewal). */
  noticeDeadline: string | null;
  paymentTerm: string;
  costPerYear: number | null;
  ledgerAccount: string;
  contractLink: string;
  portalLink: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Form values: dates as yyyy-mm-dd, numbers as text ("" = empty). */
export interface ContractInput {
  contractFor: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: string;
  autoRenew: boolean;
  noticePeriod: { value: string; unit: NoticeUnit };
  paymentTerm: string;
  costPerYear: string;
  ledgerAccount: string;
  contractLink: string;
  portalLink: string;
  notes: string;
}

export interface ContractList {
  items: Contract[];
  totals: { count: number; costPerYear: number | null; withCost: number };
}

export async function listContractsAction(params: { q?: string }): Promise<ActionResponse<ContractList>> {
  return apiRequest<ContractList>("/contracts", { query: params, fallbackError: "Failed to load the contracts." });
}

export async function getContractAction(id: string): Promise<ActionResponse<Contract>> {
  return apiRequest<Contract>(`/contracts/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this contract." });
}

export async function createContractAction(data: ContractInput): Promise<ActionResponse<Contract>> {
  return apiRequest<Contract>("/contracts", { method: "POST", body: data, fallbackError: "Failed to add the contract." });
}

export async function updateContractAction(id: string, data: ContractInput): Promise<ActionResponse<Contract>> {
  return apiRequest<Contract>(`/contracts/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the contract." });
}

export async function deleteContractAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/contracts/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the contract." });
}
