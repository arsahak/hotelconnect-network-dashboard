import { NextResponse, type NextRequest } from "next/server";
import { createWebsiteHandoffAction } from "@/app/actions/auth";
import { auth } from "@/auth";
import { WEBSITE_URL } from "@/lib/site";

/** Only paths on the website, never another site. */
function safeWebsitePath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/suppliers";
}

function toWebsite(path: string, params: Record<string, string>) {
  const url = new URL(path, WEBSITE_URL);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return NextResponse.redirect(url);
}

/**
 * GET /api/website-login?next=/suppliers
 * The website's "Log in to book" link. Signed-out visitors are sent to the
 * sign-in page first (by the proxy) and come back here. A signed-in supplier
 * goes back to the website with a one-time code; the website exchanges it.
 */
export async function GET(request: NextRequest) {
  const next = safeWebsitePath(request.nextUrl.searchParams.get("next"));
  const session = await auth();

  if (session?.user?.role !== "supplier") return toWebsite(next, { login: "not-supplier" });

  const res = await createWebsiteHandoffAction();
  if (!res.ok || !res.data?.code) return toWebsite(next, { login: "failed" });

  return toWebsite("/auth/callback", { code: res.data.code, next });
}
