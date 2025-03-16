import { formatCurrency } from "@/lib/formatters";

type PriceTier = {
  min_quantity: number;
  max_quantity: number | null;
  price: number;
};

interface PriceTierDisplayProps {
  priceTiers: PriceTier[];
  basePrice: number;
  currentQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  showUpsell?: boolean;
}

export function PriceTierDisplay({
  priceTiers,
  basePrice,
  currentQuantity = 0,
  onQuantityChange,
  showUpsell = true,
}: PriceTierDisplayProps) {
  if (!priceTiers || priceTiers.length === 0) {
    return null;
  }

  // Ensure price tiers are properly formatted
  const formattedTiers = priceTiers.map((tier) => ({
    min_quantity: Number(tier.min_quantity),
    max_quantity: tier.max_quantity !== null ? Number(tier.max_quantity) : null,
    price: Number(tier.price),
  }));

  // Sort tiers by min_quantity
  const sortedTiers = [...formattedTiers].sort(
    (a, b) => a.min_quantity - b.min_quantity,
  );

  // Find the current tier based on quantity
  let currentTier = sortedTiers.find(
    (tier) =>
      currentQuantity >= tier.min_quantity &&
      (tier.max_quantity === null || currentQuantity <= tier.max_quantity),
  );

  // If no tier matches and quantity is higher than the highest tier, use the highest tier
  if (
    !currentTier &&
    sortedTiers.length > 0 &&
    currentQuantity > sortedTiers[sortedTiers.length - 1]?.min_quantity
  ) {
    currentTier = sortedTiers[sortedTiers.length - 1];
  }

  // Find the next tier for upsell
  const nextTier = currentTier
    ? sortedTiers.find((tier) => tier.min_quantity > currentTier.min_quantity)
    : null;

  // Calculate how many more items needed for next tier
  const itemsForNextTier = nextTier
    ? nextTier.min_quantity - currentQuantity
    : null;

  // Calculate savings percentage compared to base price
  const calculateSavings = (tierPrice: number) => {
    if (basePrice <= 0 || tierPrice >= basePrice) return 0;
    return ((basePrice - tierPrice) / basePrice) * 100;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        {sortedTiers.map((tier, index) => {
          const isCurrentTier =
            currentTier && tier.min_quantity === currentTier.min_quantity;
          const tierLabel = tier.max_quantity
            ? `${tier.min_quantity}-${tier.max_quantity}`
            : `${tier.min_quantity}+`;
          const savings = calculateSavings(tier.price);

          return (
            <div
              key={index}
              className={`flex justify-between items-center p-2 rounded-md ${isCurrentTier ? "bg-primary/10 border border-primary" : "bg-muted/50"}`}
            >
              <div>
                <span className="font-medium">{tierLabel} units</span>
                {savings > 0 && (
                  <span className="ml-2 text-sm text-green-600 font-medium">
                    Save {savings.toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="font-semibold">
                {formatCurrency(tier.price)} / unit
              </div>
            </div>
          );
        })}
      </div>

      {showUpsell && nextTier && itemsForNextTier && itemsForNextTier > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            <span className="font-semibold">Quantity discount available!</span>{" "}
            Add {itemsForNextTier} more units to get a price of{" "}
            {formatCurrency(nextTier.price)} per unit
            {onQuantityChange && (
              <button
                onClick={() => onQuantityChange(nextTier.min_quantity)}
                className="ml-2 text-white bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded text-xs font-medium"
              >
                Update Quantity
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
