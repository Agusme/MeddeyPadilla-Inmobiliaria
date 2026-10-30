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
