"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { apiRequest, type ActionResponse } from "@/lib/api";

// Error codes, not sentences: the sign-in page shows them in the chosen language.
export type SigninError = "required" | "invalid" | "inactive" | "invalidCode" | "unknown";
export type SigninResult = {
  ok: boolean;
  error?: SigninError;
  redirectTo?: string;
  /** Admins: the password was right; ask for the emailed code (briefing §7). */
  twoFactor?: { challenge: string; email: string };
};

export async function signoutAction(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}

/** One sign-in for every role (see the "credentials" provider in auth.ts). */
export async function signinAction(
  _prevState: SigninResult,
  formData: FormData,
): Promise<SigninResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const challenge = String(formData.get("challenge") ?? "");
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");
  const secondStep = Boolean(challenge);

  if (secondStep ? !code : !email || !password) return { ok: false, error: "required", twoFactor: secondStep ? { challenge, email: String(formData.get("maskedEmail") ?? "") } : undefined };

  try {
    await signIn("credentials", secondStep ? { challenge, code, redirect: false } : { email, password, redirect: false });
    // Only follow our own paths after sign-in, never another site.
    const safeUrl = callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/dashboard";
    return { ok: true, redirectTo: safeUrl };
  } catch (error) {
    if (error instanceof AuthError) {
      const errorCode = (error as AuthError & { code?: string }).code ?? "";
      if (errorCode.startsWith("two_factor:")) {
        const [, nextChallenge, maskedEmail] = errorCode.split(":");
        return { ok: false, twoFactor: { challenge: nextChallenge, email: maskedEmail ?? "" } };
      }
      if (errorCode === "invalid_code") return { ok: false, error: "invalidCode", twoFactor: { challenge, email: String(formData.get("maskedEmail") ?? "") } };
      if (errorCode === "inactive") return { ok: false, error: "inactive" };
      if (error.type === "CredentialsSignin") return { ok: false, error: "invalid" };
    }
    return { ok: false, error: "unknown" };
  }
}

/**
 * One-time code (valid 60 s) that signs the current supplier in on the public
 * website, where "Boek nu" on vouchers is only for signed-in suppliers (§2.4).
 */
export async function createWebsiteHandoffAction(): Promise<ActionResponse<{ code: string }>> {
  return apiRequest<{ code: string }>("/auth/handoff", {
    method: "POST",
    fallbackError: "Could not sign you in on the website.",
  });
}
