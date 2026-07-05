/**
 * Picks the first Tailwind text-size class whose max length still fits
 * `value`, falling back to the smallest size. Used to shrink long Rupiah
 * amounts so they stay on one line inside tight grid/flex columns instead
 * of wrapping or overflowing.
 */
export function fitTextSizeClass(
  value: string,
  tiers: ReadonlyArray<readonly [maxLength: number, className: string]>,
  fallback: string,
): string {
  for (const [maxLength, className] of tiers) {
    if (value.length <= maxLength) return className;
  }
  return fallback;
}
