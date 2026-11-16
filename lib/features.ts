import type { Features } from "@/app/actions/registration";

/** All Phase 2 features off: the default when the settings can't be read. */
export const NO_FEATURES: Features = { vouchers: false, advertising: false, reviews: false };
