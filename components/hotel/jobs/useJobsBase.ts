"use client";

import { usePathname } from "next/navigation";

/**
 * The job pages serve hotels (/hotel/jobs) and, since 31 Oct, suppliers with
 * a maintenance contract (/supplier/jobs). Links follow the current portal.
 */
export function useJobsBase() {
  const pathname = usePathname();
  const supplier = pathname?.startsWith("/supplier") ?? false;
  return { base: supplier ? "/supplier/jobs" : "/hotel/jobs", supplier };
}
