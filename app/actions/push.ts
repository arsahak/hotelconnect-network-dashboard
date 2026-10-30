"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// Push notifications for the dashboard PWA (hotel managers and suppliers).

export async function getPushKeyAction(): Promise<ActionResponse<{ publicKey: string }>> {
  return apiRequest("/push/public-key", { fallbackError: "Push notifications are not available." });
}

export async function subscribePushAction(subscription: { endpoint: string; keys: { p256dh: string; auth: string } }): Promise<ActionResponse<null>> {
  return apiRequest("/push/subscribe", { method: "POST", body: subscription, fallbackError: "Push notifications could not be switched on." });
}

export async function unsubscribePushAction(endpoint: string): Promise<ActionResponse<null>> {
  return apiRequest("/push/subscribe", { method: "DELETE", body: { endpoint }, fallbackError: "Push notifications could not be switched off." });
}
