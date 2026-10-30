"use server";

import { apiRequest, type ActionResponse, type Page } from "@/lib/api";

// Jobs at member hotels. A job is shown on the website once its status is
// "published" (briefing §6: published after an admin approves it).

export type VacancyStatus = "pending" | "published" | "closed";

export interface Vacancy {
  _id: string;
  hotel: { _id: string; name: string; city: string; memberNumber: string; slug?: string };
  title: string;
  slug: string;
  description: string;
  category: string;
  employmentType: string;
  city: string;
  region: string;
  urgent: boolean;
  status: VacancyStatus;
  applyEmail: string;
  applyWhatsapp: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacancyInput {
  hotel: string;
  title: string;
  description: string;
  category: string;
  employmentType: string;
  urgent: boolean;
  status: VacancyStatus;
  /** Empty = the hotel's vacancies (or general) email. */
  applyEmail: string;
  applyWhatsapp: string;
}

export type VacancyListParams = { q?: string; status?: string; hotel?: string; page?: number; limit?: number };

export async function listVacanciesAction(params: VacancyListParams): Promise<ActionResponse<Page<Vacancy>>> {
  return apiRequest<Page<Vacancy>>("/vacancies/admin", { query: params, fallbackError: "Failed to load the jobs." });
}

export async function getVacancyAction(id: string): Promise<ActionResponse<Vacancy>> {
  return apiRequest<Vacancy>(`/vacancies/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this job." });
}

export async function createVacancyAction(data: VacancyInput): Promise<ActionResponse<Vacancy>> {
  return apiRequest<Vacancy>("/vacancies/admin", { method: "POST", body: data, fallbackError: "Failed to add the job." });
}

export async function updateVacancyAction(id: string, data: Partial<VacancyInput>): Promise<ActionResponse<Vacancy>> {
  return apiRequest<Vacancy>(`/vacancies/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save the job.",
  });
}

export async function deleteVacancyAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/vacancies/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to delete the job.",
  });
}
