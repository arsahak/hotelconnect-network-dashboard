"use server";

import { API, type ActionResponse } from "@/lib/api";

// "Forgot password?" for every dashboard user: email → code → new password.
// No session here, so these call the API without a token.

async function publicPost<T>(path: string, body: unknown, fallbackError: string): Promise<ActionResponse<T>> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string; data?: T };
    return res.ok ? { ok: true, data: json.data ?? null } : { ok: false, error: json.message || fallbackError };
  } catch {
    return { ok: false, error: fallbackError };
  }
}

/** Emails a short code to the address. */
export async function requestResetCodeAction(email: string) {
  return publicPost<null>("/auth/forgot-password", { email }, "The code could not be sent.");
}

/** Checks the code; returns a one-time token for the next step. */
export async function verifyResetCodeAction(email: string, otp: string) {
  return publicPost<{ resetToken: string }>("/auth/forgot-password/verify-otp", { email, otp }, "The code could not be checked.");
}

export async function setNewPasswordAction(email: string, resetToken: string, newPassword: string) {
  return publicPost<null>("/auth/reset-password", { email, resetToken, newPassword }, "The password could not be changed.");
}
