"use server";

import { apiRequest, type ActionResponse, type Page } from "@/lib/api";

// Stories (articles, interviews, columns) for the website's content section.
// The API cleans the HTML and works out the reading time.

export type ArticleStatus = "draft" | "published";

export interface Article {
  _id: string;
  title: string;
  slug: string;
  kind: string;
  excerpt: string;
  /** HTML — only on the single-story call. */
  body?: string;
  image: string;
  readingMinutes: number;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleInput {
  title: string;
  kind: string;
  excerpt: string;
  body: string;
  status: ArticleStatus;
  /** yyyy-mm-dd; empty = today when published. */
  publishedAt: string;
}

export type ArticleListParams = { q?: string; kind?: string; status?: string; page?: number; limit?: number };

export async function listArticlesAction(params: ArticleListParams): Promise<ActionResponse<Page<Article>>> {
  return apiRequest<Page<Article>>("/articles/admin", { query: params, fallbackError: "Failed to load the stories." });
}

export async function getArticleAction(id: string): Promise<ActionResponse<Article>> {
  return apiRequest<Article>(`/articles/admin/${encodeURIComponent(id)}`, { fallbackError: "Failed to load this story." });
}

export async function createArticleAction(data: ArticleInput): Promise<ActionResponse<Article>> {
  return apiRequest<Article>("/articles/admin", { method: "POST", body: data, fallbackError: "Failed to add the story." });
}

export async function updateArticleAction(id: string, data: Partial<ArticleInput>): Promise<ActionResponse<Article>> {
  return apiRequest<Article>(`/articles/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: data,
    fallbackError: "Failed to save the story.",
  });
}

export async function deleteArticleAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/articles/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
    fallbackError: "Failed to delete the story.",
  });
}

export async function uploadArticleImageAction(id: string, formData: FormData): Promise<ActionResponse<Article>> {
  return apiRequest<Article>(`/articles/admin/${encodeURIComponent(id)}/image`, {
    method: "PUT",
    body: formData,
    fallbackError: "Failed to upload the photo.",
  });
}

export async function deleteArticleImageAction(id: string): Promise<ActionResponse<Article>> {
  return apiRequest<Article>(`/articles/admin/${encodeURIComponent(id)}/image`, {
    method: "DELETE",
    fallbackError: "Failed to remove the photo.",
  });
}
