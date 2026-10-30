import { adminDownload } from "@/lib/apiDownload";

/** GET /api/purchasing/:id/invoice/:pid — one hotel's invoice (admins). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; pid: string }> }) {
  const { id, pid } = await params;
  return adminDownload(`/purchasing/admin/${encodeURIComponent(id)}/participants/${encodeURIComponent(pid)}/invoice`);
}
