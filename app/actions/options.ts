"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

export interface Options {
  regions: string[];
  supplierRegions: string[];
  vacancyCategories: string[];
  employmentTypes: string[];
  supplierCategories: string[];
  voucherCategories: string[];
  articleKinds: string[];
  faultTypes: string[];
  noticeUnits: string[];
  portalCategories: string[];
  tenderTypes: string[];
}

/** The fixed lists behind every dropdown (regions, categories, …). */
export async function getOptionsAction(): Promise<ActionResponse<Options>> {
  return apiRequest<Options>("/meta/options", { fallbackError: "Failed to load the lists." });
}
