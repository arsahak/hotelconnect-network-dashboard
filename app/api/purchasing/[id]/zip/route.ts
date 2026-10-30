import { adminDownload } from "@/lib/apiDownload";

/** GET /api/purchasing/:id/zip — every invoice of a collective purchase as one ZIP (admins). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminDownload(`/purchasing/admin/${encodeURIComponent(id)}/zip`);
}
