"use client";

import type { PortalLink } from "@/app/actions/portalLink";
import { useOptionLabel } from "@/lib/useOptions";

/** The category as shown: the manager's own name for "Other", else the translated category. */
export function usePortalCategory() {
  const optionLabel = useOptionLabel();
  return (link: Pick<PortalLink, "category" | "customCategory">) =>
    link.category === "Other" && link.customCategory ? link.customCategory : optionLabel("portalCategories", link.category);
}
