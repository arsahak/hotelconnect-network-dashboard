/**
 * Shrinks a photo in the browser until it is at most `maxBytes` (Master
 * Briefing v4: issue photos max 150KB), as JPEG. Returns null if it can't.
 */
export async function compressPhoto(file: File, maxBytes = 150 * 1024): Promise<File | null> {
  if (file.size <= maxBytes && file.type === "image/jpeg") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;
  let width = Math.min(1280, bitmap.width);
  for (let attempt = 0; attempt < 8; attempt++) {
    const height = Math.round((bitmap.height / bitmap.width) * width);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
    for (const quality of [0.8, 0.65, 0.5]) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= maxBytes) return new File([blob], "photo.jpg", { type: "image/jpeg" });
    }
    width = Math.round(width * 0.75);
  }
  return null;
}
