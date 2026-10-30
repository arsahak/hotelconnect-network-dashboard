import { auth } from "@/auth";

/** Base URL of the Express API, e.g. http://localhost:8000/api/v1 */
export const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;

/** What every server action returns to a component. */
export interface ActionResponse<T = unknown> {
  ok: boolean;
  data?: T | null;
  error?: string;
  fieldErrors?: string[];
}

export async function getAuthToken() {
  const session = await auth();
  return session?.user?.accessToken;
}

async function parseError(
  res: Response,
  fallback: string,
): Promise<{ message: string; errors?: string[] }> {
  try {
    const body = await res.json();
    return {
      message: typeof body?.message === "string" ? body.message : fallback,
      errors: Array.isArray(body?.errors) && body.errors.length ? body.errors : undefined,
    };
  } catch {
    return { message: fallback };
  }
}

/**
 * Calls the API as the signed-in user and unwraps `{ data }`.
 * JSON bodies are sent as JSON; FormData (file uploads) is sent as-is.
 */
export async function apiRequest<T>(
  path: string,
  {
    method = "GET",
    query,
    body,
    fallbackError,
  }: {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    /** Added as ?key=value (empty values are left out). */
    query?: Record<string, string | number | boolean | undefined | null>;
    body?: unknown;
    fallbackError: string;
  },
): Promise<ActionResponse<T>> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const isForm = body instanceof FormData;
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
    }
    const qs = params.toString();
    const res = await fetch(`${API}${path}${qs ? `?${qs}` : ""}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const { message, errors } = await parseError(res, fallbackError);
      return { ok: false, error: message, fieldErrors: errors };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, data: (json?.data ?? null) as T };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

/** A paged list from the API. */
export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}
