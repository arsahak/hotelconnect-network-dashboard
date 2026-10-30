"use client";

import { useEffect } from "react";

/** Registers the service worker (installable app + push notifications). */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => console.error("[pwa] service worker:", error));
    }
  }, []);
  return null;
}
