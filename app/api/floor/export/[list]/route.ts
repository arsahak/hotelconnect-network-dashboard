import type { NextRequest } from "next/server";
import { hotelDownload } from "@/lib/apiDownload";

/** CSV export of a floor checklist or the waste list (opens in Excel). */
export async function GET(request: NextRequest, { params }: { params: Promise<{ list: string }> }) {
  const { list } = await params;
  const qs = request.nextUrl.searchParams.toString();
  return hotelDownload(`/floor/export/${encodeURIComponent(list)}${qs ? `?${qs}` : ""}`);
}
