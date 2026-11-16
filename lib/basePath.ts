/**
 * Client (31 Oct): in production the dashboard lives inside the website, at
 * hotelconnect-network.nl/dashboard. NEXT_PUBLIC_BASE_PATH is "/dashboard"
 * there and empty in local development. Links (next/link, router) get it
 * automatically; plain URLs — images, window.location, the service worker —
 * go through withBase().
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export const withBase = (path: string) => `${BASE_PATH}${path}`;
