import { auth } from "@/auth";
import { ADMIN_ROLES, isUserRole } from "@/config/access";
import { API } from "@/lib/api";

/**
 * Passes a private file (PDF/ZIP) from the API through to the browser, so the
 * admin's token never reaches the page. Admins only.
 */
export async function adminDownload(path: string): Promise<Response> {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.accessToken || !isUserRole(role) || !ADMIN_ROLES.includes(role)) {
    return new Response("Not allowed", { status: 403 });
  }
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${session.user.accessToken}` },
    cache: "no-store",
  });
  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => ({}));
    return new Response(body?.message || "The file could not be downloaded.", { status: res.status || 502 });
  }
  const headers = new Headers();
  for (const name of ["content-type", "content-disposition", "content-length"]) {
    const value = res.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("cache-control", "no-store");
  return new Response(res.body, { status: 200, headers });
}
