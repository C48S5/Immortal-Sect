import Decimal from 'break_infinity.js';

export { Decimal };

/** Shorthand Decimal constructor */
export function D(n: number | string): Decimal {
  return new Decimal(n);
}

/**
 * Suffix table for number formatting.
 * Below 1K: raw integer. 1K+: suffix notation. No scientific notation.
 */
const SUFFIXES: [Decimal, string][] = [
  [new Decimal('1e66'), 'Uvg'],
  [new Decimal('1e63'), 'Vg'],
  [new Decimal('1e60'), 'Nod'],
  [new Decimal('1e57'), 'Ocd'],
  [new Decimal('1e54'), 'Spd'],
  [new Decimal('1e51'), 'Sxd'],
  [new Decimal('1e48'), 'Qid'],
  [new Decimal('1e45'), 'Qad'],
  [new Decimal('1e42'), 'Td'],
  [new Decimal('1e39'), 'Dd'],
  [new Decimal('1e36'), 'Ud'],
  [new Decimal('1e33'), 'Dc'],
  [new Decimal('1e30'), 'No'],
  [new Decimal('1e27'), 'Oc'],
  [new Decimal('1e24'), 'Sp'],
  [new Decimal('1e21'), 'Sx'],
  [new Decimal('1e18'), 'Qi'],
  [new Decimal('1e15'), 'Qa'],
  [new Decimal('1e12'), 'T'],
  [new Decimal('1e9'), 'B'],
  [new Decimal('1e6'), 'M'],
  [new Decimal('1e3'), 'K'],
];

/**
 * Formats a Decimal into a human-readable string.
 * Below 1K: raw integer. 1K-999.99K: "X.XXK". Same for M, B, T.
 * Beyond T: English name abbreviations. No scientific notation ever.
 */
export function formatNumber(n: Decimal): string {
  if (n.lt(0)) {
    return '-' + formatNumber(n.neg());
  }

  if (n.lt(1000)) {
    return n.floor().toString();
  }

  for (const [threshold, suffix] of SUFFIXES) {
    if (n.gte(threshold)) {
      const divided = n.div(threshold);
      // Show up to 2 decimal places, strip trailing zeros
      const value = divided.toNumber();
      if (value >= 100) {
        return Math.floor(value).toString() + suffix;
      }
      if (value >= 10) {
        return (Math.floor(value * 10) / 10).toFixed(1).replace(/\.0$/, '') + suffix;
      }
      return (Math.floor(value * 100) / 100).toFixed(2).replace(/\.?0+$/, '') + suffix;
    }
  }

  // Fallback (should not reach here given suffixes go up to 1e66)
  return n.floor().toString();
}

/**
 * Calculates the total cost to buy `buying` units when you already own `owned`.
 * Uses geometric series: baseCost * coeff^owned * (coeff^buying - 1) / (coeff - 1)
 */
export function bulkCost(
  baseCost: Decimal,
  coeff: number,
  owned: number,
  buying: number,
): Decimal {
  if (buying <= 0) return D(0);
  if (coeff === 1) return baseCost.mul(buying);

  const coeffDec = new Decimal(coeff);
  return baseCost
    .mul(coeffDec.pow(owned))
    .mul(coeffDec.pow(buying).sub(1))
    .div(coeffDec.sub(1));
}

/**
 * Binary search for the maximum number of units purchasable with a given budget.
 * Returns the count of units that can be bought (0 if none affordable).
 */
export function maxAffordable(
  baseCost: Decimal,
  coeff: number,
  owned: number,
  budget: Decimal,
): number {
  if (budget.lt(bulkCost(baseCost, coeff, owned, 1))) {
    return 0;
  }

  // Upper bound: double until we exceed budget
  let lo = 1;
  let hi = 2;
  while (bulkCost(baseCost, coeff, owned, hi).lte(budget)) {
    hi *= 2;
    if (hi > 1e9) break; // Safety cap
  }

  // Binary search between lo and hi
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (bulkCost(baseCost, coeff, owned, mid).lte(budget)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return lo;
}
