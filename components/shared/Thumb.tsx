import Image from "next/image";
import { BiImage } from "react-icons/bi";
import { cn } from "@/lib/utils";

/**
 * A photo that fills its (relative) parent, or a grey tile with an icon when
 * there is none. Not optimised by Next, so photos from any host work
 * (Spaces, local uploads, placeholders).
 */
export function Thumb({
  src,
  alt,
  fit = "cover",
  className,
}: {
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  if (!src) {
    return (
      <span className={cn("absolute inset-0 grid place-items-center text-gray-300", className)} aria-hidden="true">
        <BiImage size={26} />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="240px"
      className={cn(fit === "cover" ? "object-cover" : "object-contain p-2", className)}
    />
  );
}
