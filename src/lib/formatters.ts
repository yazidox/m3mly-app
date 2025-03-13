/**
 * Format a number as Moroccan Dirham (MAD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat("fr-MA").format(number);
}
