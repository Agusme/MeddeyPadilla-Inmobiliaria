export const maxPropertyPhotos = 30;
export const maxPropertyPhotoBytes = 8 * 1024 * 1024;

// Upload indexes must match the remaining files sent in FormData.
export function removePropertyPhoto<T>(files: T[], imageOrder: string[], key: string) {
  const remaining = imageOrder.filter((item) => item !== key);
  if (!key.startsWith("new:")) return { files, imageOrder: remaining };
  const removedIndex = Number(key.split(":")[1]);
  return {
    files: files.filter((_, index) => index !== removedIndex),
    imageOrder: remaining.map((item) => {
      const [kind, rawIndex] = item.split(":");
      const index = Number(rawIndex);
      return kind === "new" && index > removedIndex ? `new:${index - 1}` : item;
    }),
  };
}

export function uniqueNewPropertyPhotos(files: File[], selected: File[]) {
  const identity = (file: File) => JSON.stringify([file.name, file.size, file.lastModified, file.type]);
  const seen = new Set(files.map(identity));

  return selected.filter((file) => {
    const key = identity(file);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
