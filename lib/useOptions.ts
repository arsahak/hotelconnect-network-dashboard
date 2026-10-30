"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { getOptionsAction, type Options } from "@/app/actions/options";

// One request per page load, shared by every form and filter.
let optionsPromise: Promise<Options | null> | null = null;

/** Regions and categories from the API (null while loading). */
export function useOptions(): Options | null {
  const [options, setOptions] = useState<Options | null>(null);
  useEffect(() => {
    optionsPromise ??= getOptionsAction().then((res) => res.data ?? null);
    let current = true;
    optionsPromise.then((value) => {
      if (current) setOptions(value);
    });
    return () => {
      current = false;
    };
  }, []);
  return options;
}

export type OptionGroup =
  | "regions"
  | "vacancyCategories"
  | "employmentTypes"
  | "supplierCategories"
  | "voucherCategories"
  | "articleKinds"
  | "faultTypes"
  | "portalCategories"
  | "tenderTypes";

/**
 * The API stores English values ("Kitchen", "North Holland"). This shows them
 * in the dashboard language, using messages "Options.<group>.<value>", and
 * falls back to the value itself.
 */
export function useOptionLabel() {
  const t = useTranslations("Options");
  return useCallback(
    (group: OptionGroup, value: string) => {
      const key = `${group}.${value}`;
      return t.has(key) ? t(key) : value;
    },
    [t],
  );
}
