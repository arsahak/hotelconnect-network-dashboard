"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

/**
 * Uploads an image used inside rich-text content (RichTextEditor). A
 * resource's own photos/logos are uploaded through that resource instead.
 */
export async function uploadEditorImageAction(
  formData: FormData,
): Promise<ActionResponse<{ url: string }>> {
  return apiRequest<{ url: string }>("/uploads/image", {
    method: "POST",
    body: formData,
    fallbackError: "Failed to upload image.",
  });
}
