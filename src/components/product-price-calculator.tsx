"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/formatters";
import { PriceTierDisplay } from "./price-tier-display";

type PriceTier = {
  min_quantity: number;
  max_quantity: number | null;
  price: number;
};

interface ProductPriceCalculatorProps {
  basePrice: number;
  priceTiers?: PriceTier[];
  minOrderQuantity: number;
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onTotalPriceChange?: (price: number) => void;
}

export function ProductPriceCalculator({
  basePrice,
  priceTiers = [],
  minOrderQuantity,
  initialQuantity,
  onQuantityChange,
  onTotalPriceChange,
}: ProductPriceCalculatorProps) {
  const [quantity, setQuantity] = useState(initialQuantity || minOrderQuantity);
  const [unitPrice, setUnitPrice] = useState(basePrice);
  const [totalPrice, setTotalPrice] = useState(basePrice * quantity);

  // Calculate the unit price based on quantity and price tiers
  const calculateUnitPrice = (qty: number) => {
    if (!priceTiers || priceTiers.length === 0) {
      return basePrice;
    }

    // Sort tiers by min_quantity
    const sortedTiers = [...priceTiers].sort(
      (a, b) => a.min_quantity - b.min_quantity,
    );

    // Find the applicable price tier
    const applicableTier = sortedTiers.find(
      (tier) =>
        qty >= tier.min_quantity &&
        (tier.max_quantity === null || qty <= tier.max_quantity),
    );

    // If no tier matches and quantity is higher than any tier's min_quantity,
    // use the highest tier's price for quantities above the highest tier
    if (!applicableTier && sortedTiers.length > 0) {
      const highestTier = sortedTiers[sortedTiers.length - 1];
      if (qty > highestTier.min_quantity) {
        return highestTier.price;
      }
    }

    return applicableTier ? applicableTier.price : basePrice;
  };

  // Update prices when quantity changes
  useEffect(() => {
    const newUnitPrice = calculateUnitPrice(quantity);
    setUnitPrice(newUnitPrice);
    const newTotalPrice = newUnitPrice * quantity;
    setTotalPrice(newTotalPrice);

    if (onTotalPriceChange) {
      onTotalPriceChange(newTotalPrice);
    }
  }, [quantity, basePrice, priceTiers]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || minOrderQuantity;
    const validQuantity = Math.max(newQuantity, minOrderQuantity);
    setQuantity(validQuantity);

    if (onQuantityChange) {
      onQuantityChange(validQuantity);
    }
  };

  // Handle direct quantity update (from tier selection)
  const handleDirectQuantityUpdate = (newQuantity: number) => {
    setQuantity(newQuantity);

    if (onQuantityChange) {
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="quantity" className="block text-sm font-medium">
          Quantity
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min={minOrderQuantity}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Minimum order quantity: {minOrderQuantity}
        </p>
      </div>

      {priceTiers && priceTiers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Volume Pricing</h4>
          <PriceTierDisplay
            priceTiers={priceTiers}
            basePrice={basePrice}
            currentQuantity={quantity}
            onQuantityChange={handleDirectQuantityUpdate}
          />
        </div>
      )}

      <div className="bg-muted p-4 rounded-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Unit Price:</span>
          <span className="font-medium">{formatCurrency(unitPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Quantity:</span>
          <span className="font-medium">{quantity}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total Price:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
