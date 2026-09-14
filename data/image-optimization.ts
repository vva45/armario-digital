export type ImageVersion = { file: File; width: number; height: number };

export async function inspectImage(file: File): Promise<ImageVersion> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const result = { file, width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return result;
}

export async function createOptimizedCopy(file: File, maxDimension = 2400): Promise<ImageVersion> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: file.type !== "image/jpeg" });
  if (!context) { bitmap.close(); throw new Error("Este navegador no puede preparar la copia optimizada."); }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const outputType = file.type === "image/png" ? "image/webp" : file.type;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, 0.88));
  if (!blob) throw new Error("No se pudo preparar la copia optimizada.");
  const extension = outputType === "image/webp" ? "webp" : "jpg";
  return { file: new File([blob], `copia-optimizada.${extension}`, { type: outputType }), width, height };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
