import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGOS = {
  dark: "/assets/logo/hotelconnect-network-blacklogo.svg",
  light: "/assets/logo/hotelconnect-network-whitelogo.svg",
};

/**
 * The HotelConnect Network logo (same files as the website).
 * - dark: black lettering, for light backgrounds (every place in the dashboard)
 * - light: white lettering, for dark backgrounds
 * - compact: only the golden "H" mark, for the collapsed sidebar
 */
export function Logo({
  tone = "dark",
  compact = false,
  className,
}: {
  tone?: keyof typeof LOGOS;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      // shapelogo.png is 903 × 1083; shown 36px high.
      <Image
        src="/assets/logo/shapelogo.png"
        alt="HotelConnect"
        width={30}
        height={36}
        className={cn("h-9 w-auto shrink-0", className)}
      />
    );
  }

  return (
    // The SVGs are 1600 × 402: width/height keep that ratio so the logo isn't
    // squeezed. Shown 44px high, straight from the vector file.
    <Image
      src={LOGOS[tone]}
      alt="HotelConnect Network"
      width={1600}
      height={402}
      unoptimized
      className={cn("h-11 w-auto shrink-0 select-none", className)}
    />
  );
}
