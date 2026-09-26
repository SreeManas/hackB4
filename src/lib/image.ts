const UNSPLASH = 'images.unsplash.com';

/** Request a right-sized, modern-format image from CDNs that support it (currently Unsplash). */
export function imageUrl(src: string, width: number, quality = 70): string {
  if (!src.includes(UNSPLASH)) return src;
  try {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  } catch {
    // Banner URLs come from the backend; a malformed one must not crash the page.
    return src;
  }
}

/** srcset for responsive images; returns undefined for sources that can't be resized. */
export function imageSrcSet(src: string, widths: number[]): string | undefined {
  if (!src.includes(UNSPLASH)) return undefined;
  return widths.map((w) => `${imageUrl(src, w)} ${w}w`).join(', ');
}
