import type { MetadataRoute } from "next";
import { withBase } from "@/lib/basePath";

/** Makes the dashboard installable on a phone's home screen (PWA). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HotelConnect Network",
    short_name: "HotelConnect",
    description: "The private dashboard of HotelConnect Network for boutique hotels and suppliers.",
    start_url: withBase("/dashboard"),
    scope: withBase("/"),
    display: "standalone",
    background_color: "#1b1611",
    theme_color: "#1b1611",
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: withBase("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
