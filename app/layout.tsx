import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/layout/PwaRegister";
import { Gilda_Display, Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Same fonts as the public website.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const gilda = Gilda_Display({
  variable: "--font-gilda",
  subsets: ["latin"],
  weight: "400",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001").replace(
  /\/+$/,
  "",
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "HotelConnect Dashboard",
  title: {
    default: "HotelConnect Dashboard",
    template: "%s | HotelConnect Dashboard",
  },
  description:
    "The private dashboard of HotelConnect Network for boutique hotels, suppliers and the HotelConnect team.",
  // Installable on a phone's home screen (app/manifest.ts, public/sw.js).
  appleWebApp: { capable: true, title: "HotelConnect", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1611",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} ${gilda.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <PwaRegister />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: { fontSize: "0.875rem", fontWeight: 500 },
              success: {
                style: { background: "#e2ece4", color: "#3f6b4f", border: "1px solid #c5d9ca" },
              },
              error: {
                style: { background: "#f6e4e0", color: "#a4473a", border: "1px solid #ecc9c1" },
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
