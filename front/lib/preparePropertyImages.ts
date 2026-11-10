// Leave room for multipart boundaries and property fields below Vercel's 4.5 MB limit.
const imageBudget = 3_800_000;

async function compressImage(file: File, budget: number): Promise<File> {
  if (file.size <= budget) return file;
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudieron preparar las fotos en este navegador.");
    let maxSide = 2000;
    for (let attempt = 0; attempt < 7; attempt++) {
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
      if (blob && blob.size <= budget) {
        return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
      }
      maxSide *= 0.75;
    }
    throw new Error("Las fotos pesan demasiado. Probá con imágenes de menor tamaño.");
  } catch (error) {
    if (error instanceof Error && error.name !== "EncodingError") throw error;
    throw new Error(`No se pudo procesar la foto ${file.name}. Probá convertirla a JPG o PNG.`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function preparePropertyImages(data: FormData): Promise<FormData> {
  const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.reduce((size, file) => size + file.size, 0) <= imageBudget) return data;
  // Work sequentially to avoid decoding twelve large photos in memory at once.
  const prepared: File[] = [];
  for (const file of files) prepared.push(await compressImage(file, Math.floor(imageBudget / files.length)));
  const result = new FormData();
  data.forEach((value, key) => { if (key !== "images") result.append(key, value); });
  prepared.forEach((file) => result.append("images", file));
  return result;
}
