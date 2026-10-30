"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The dashboard inbox of a hotel manager or supplier (briefing §3.12, §4.4).

export type NotificationType = "compliance" | "tender" | "vacancy" | "fault" | "system" | "advertising";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  readAt: string | null;
  createdAt: string;
}

export async function listNotificationsAction(params: { unread?: boolean }): Promise<ActionResponse<{ items: AppNotification[]; unread: number }>> {
  return apiRequest("/notifications", { query: { unread: params.unread || undefined }, fallbackError: "Failed to load the notifications." });
}

export async function unreadCountAction(): Promise<ActionResponse<{ unread: number }>> {
  return apiRequest("/notifications/unread-count", { fallbackError: "Failed to load the notifications." });
}

export async function markReadAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "POST", fallbackError: "Failed to update the notification." });
}

export async function markAllReadAction(): Promise<ActionResponse<{ updated: number }>> {
  return apiRequest("/notifications/read-all", { method: "POST", fallbackError: "Failed to update the notifications." });
}
