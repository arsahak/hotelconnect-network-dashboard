// Who may open which part of the dashboard. Used by the proxy (to block a
// page) and by the sidebar/search (to hide links the user can't open).
// Kept free of React so the proxy can import it.

export const USER_ROLES = [
  "superadmin",
  "admin",
  "hotel_manager",
  "hotel_staff",
  "supplier",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_ROLES: UserRole[] = ["superadmin", "admin"];
export const ALL_ROLES: UserRole[] = [...USER_ROLES];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}

/**
 * Route prefix → roles allowed. The longest matching prefix wins; a path
 * with no match is open to every signed-in user.
 *
 * The dashboard holds three portals, each under its own prefix:
 * /admin (HotelConnect team), /hotel (briefing §3) and /supplier (§4).
 */
export const ROUTE_ACCESS: Record<string, UserRole[]> = {
  // Shared by every portal
  "/dashboard": ALL_ROLES,
  "/profile": ALL_ROLES,
  // Hotel staff use a shared login, so they can't change account settings.
  "/settings": ["superadmin", "admin", "hotel_manager", "supplier"],
  // The inbox: admins and the shared staff login have none.
  "/notifications": ["hotel_manager", "supplier"],

  // Admin portal: the platform and the content of the public website.
  "/admin": ADMIN_ROLES,
  // Only a superadmin can add or change team members.
  "/admin/team/add": ["superadmin"],
  "/admin/team/edit": ["superadmin"],

  // Hotel portal. The staff login only sees the storingslijst and the kennisbank.
  "/hotel": ["hotel_manager"],
  "/hotel/faults": ["hotel_manager", "hotel_staff"],
  "/hotel/faults/add": ["hotel_manager"],
  "/hotel/faults/edit": ["hotel_manager"],
  "/hotel/kennisbank": ["hotel_manager", "hotel_staff"],

  // Supplier portal
  "/supplier": ["supplier"],
};

export function canAccess(pathname: string, role: UserRole): boolean {
  const match = Object.keys(ROUTE_ACCESS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_ACCESS[match].includes(role) : true;
}
