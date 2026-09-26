export type PageItem = number | 'ellipsis';

/**
 * Page numbers to show, with ellipses for gaps. Always shows the first and last page
 * and `siblings` pages either side of the current one.
 *   getPageRange(6, 20) → [1, 'ellipsis', 5, 6, 7, 'ellipsis', 20]
 */
export function getPageRange(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 0) return [];
  // first + last + current + siblings + 2 ellipsis slots
  const maxSlots = siblings * 2 + 5;
  if (total <= maxSlots) return Array.from({ length: total }, (_, i) => i + 1);

  const page = Math.min(Math.max(current, 1), total);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, total - 1);
  const showLeftGap = left > 3;
  const showRightGap = right < total - 2;

  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  if (!showLeftGap) return [...range(1, 3 + siblings * 2), 'ellipsis', total];
  if (!showRightGap) return [1, 'ellipsis', ...range(total - 2 - siblings * 2, total)];
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', total];
}
