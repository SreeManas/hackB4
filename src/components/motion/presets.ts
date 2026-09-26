/** Shared motion constants so every animation on the site feels the same. */

/** Matches `--ease-cinematic` in globals.css. */
export const ease = [0.16, 1, 0.3, 1] as const;

/** Animate once, a little before the element is fully on screen. */
export const viewport = { once: true, margin: '-10%' } as const;

export const durations = { fast: 0.3, base: 0.6, slow: 1.2 } as const;
