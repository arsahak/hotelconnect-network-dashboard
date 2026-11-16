"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/basePath";

/** Registers the service worker (installable app + push notifications). */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(withBase("/sw.js"), { scope: withBase("/") }).catch((error) => console.error("[pwa] service worker:", error));
    }
  }, []);
  return null;
}
