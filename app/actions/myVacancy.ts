"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The signed-in hotel's own jobs (briefing §3.7). New and reopened jobs wait
// for HotelConnect; once published they are on the public jobs page.

export type MyVacancyStatus = "pending" | "published" | "closed";
export type VacancyStyle = "traditional" | "visual";

export interface MyVacancy {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  employmentType: string;
  city: string;
  urgent: boolean;
  status: MyVacancyStatus;
  style: VacancyStyle;
  image: string;
  videoUrl: string;
  applyEmail: string;
  applyWhatsapp: string;
  applicationCount: number;
  lastApplicationAt: string | null;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type MyVacancyInput = Pick<MyVacancy, "title" | "description" | "category" | "employmentType" | "urgent" | "style" | "videoUrl" | "applyEmail" | "applyWhatsapp">;

export async function listMyVacanciesAction(): Promise<ActionResponse<MyVacancy[]>> {
  return apiRequest<MyVacancy[]>("/my-vacancies", { fallbackError: "Failed to load your jobs." });
}

export async function getMyVacancyAction(id: string): Promise<ActionResponse<MyVacancy>> {
  return apiRequest<MyVacancy>(`/my-vacancies/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this job." });
}

export async function createMyVacancyAction(data: MyVacancyInput): Promise<ActionResponse<MyVacancy>> {
  return apiRequest<MyVacancy>("/my-vacancies", { method: "POST", body: data, fallbackError: "Failed to save the job." });
}

export async function updateMyVacancyAction(id: string, data: Partial<MyVacancyInput> & { status?: "closed" | "pending" }): Promise<ActionResponse<MyVacancy>> {
  return apiRequest<MyVacancy>(`/my-vacancies/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: "Failed to save the job." });
}

export async function deleteMyVacancyAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/my-vacancies/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: "Failed to delete the job." });
}

/** formData: { image: File } */
export async function uploadMyVacancyImageAction(id: string, form: FormData): Promise<ActionResponse<MyVacancy>> {
  return apiRequest<MyVacancy>(`/my-vacancies/${encodeURIComponent(id)}/image`, { method: "PUT", body: form, fallbackError: "Failed to upload the photo." });
}

export async function deleteMyVacancyImageAction(id: string): Promise<ActionResponse<MyVacancy>> {
  return apiRequest<MyVacancy>(`/my-vacancies/${encodeURIComponent(id)}/image`, { method: "DELETE", fallbackError: "Failed to remove the photo." });
}
