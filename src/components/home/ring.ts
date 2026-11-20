/* Shared by the photo stack and the reels: items stand on a ring, the current one in front. */

/* where item i stands relative to the current one: negative to the left, positive to the right */
export function ringOffset(i: number, cur: number, n: number): number {
  let d = i - cur;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export const wrapIndex = (i: number, n: number): number => ((i % n) + n) % n;

export const pad2 = (n: number): string => String(n).padStart(2, '0');
