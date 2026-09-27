export function getCoverImageIndex(images: readonly string[] = []): number {
  for (const number of [5, 4]) {
    const index = images.findIndex(image => new RegExp(`(?:/|[-_])0?${number}\\.[^.]+$`).test(image));
    if (index !== -1) return index;
  }
  return 0;
}
