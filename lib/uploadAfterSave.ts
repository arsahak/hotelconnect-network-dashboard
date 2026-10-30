import type { ActionResponse } from "@/lib/api";

/**
 * Uploads a chosen photo once the record exists. Returns an error message
 * when the upload failed (the record itself is already saved).
 */
export async function uploadAfterSave(
  file: File | null,
  upload: (formData: FormData) => Promise<ActionResponse<unknown>>,
): Promise<string | null> {
  if (!file) return null;
  const formData = new FormData();
  formData.set("image", file);
  const res = await upload(formData);
  return res.ok ? null : res.error || "Upload failed";
}
