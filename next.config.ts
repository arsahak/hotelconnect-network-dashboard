import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Loads the English/Dutch messages from i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

// Pages moved under a portal prefix (Oct 2026). Old links and bookmarks still work.
const MOVED = {
  admin: ["hotels", "suppliers", "jobs", "vouchers", "stories", "team"],
  hotel: ["contracts", "permits", "faults", "my-hotel", "onboarding"],
};

const nextConfig: NextConfig = {
  // Production: the dashboard is served at hotelconnect-network.nl/dashboard (see lib/basePath.ts).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  async redirects() {
    return Object.entries(MOVED).flatMap(([portal, pages]) =>
      pages.flatMap((page) => [
        { source: `/${page}`, destination: `/${portal}/${page}`, permanent: true },
        { source: `/${page}/:path*`, destination: `/${portal}/${page}/:path*`, permanent: true },
      ]),
    );
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      // Uploaded files (avatars, logos, photos): Hetzner Object Storage, folder hotelconnect/.
      {
        protocol: "https",
        hostname: "**.your-objectstorage.com",
        pathname: "/hotelconnect/**",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
