/**
 * Total modal for a vehicle = purchase price + all additional purchase costs.
 * Computed everywhere it is needed; never stored in the database.
 */
export function computeTotalModal(
  purchasePrice: number,
  additionalCosts: ReadonlyArray<{ amount: number }>,
): number {
  return additionalCosts.reduce((sum, cost) => sum + cost.amount, purchasePrice);
}
