"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

interface PriceTiersContainerProps {
  initialTierCount?: number;
  existingTiers?: Array<{
    min_quantity: number;
    max_quantity: number | null;
    price: number;
  }>;
}

export function PriceTiersContainer({
  initialTierCount = 1,
  existingTiers = [],
}: PriceTiersContainerProps) {
  // Initialize with existing tiers if provided, otherwise create new array
  const [tiers, setTiers] = useState<number[]>(() => {
    if (existingTiers && existingTiers.length > 0) {
      return Array.from({ length: existingTiers.length }, (_, i) => i);
    } else {
      return Array.from({ length: initialTierCount }, (_, i) => i);
    }
  });

  const addTier = () => {
    // Add a new tier with the next index
    setTiers([...tiers, tiers.length]);
  };

  const removeTier = (indexToRemove: number) => {
    if (tiers.length > 1) {
      // Remove the tier at the specified index
      const newTiers = tiers.filter((_, index) => index !== indexToRemove);

      // Renumber the tiers to ensure consecutive indices
      const renumberedTiers = newTiers.map((_, index) => index);
      setTiers(renumberedTiers);

      // Remove the input fields from the DOM to prevent ghost data
      const form = document.querySelector("form");
      if (form) {
        const minInput = form.querySelector(
          `[name="tier-min-${indexToRemove}"]`,
        );
        const maxInput = form.querySelector(
          `[name="tier-max-${indexToRemove}"]`,
        );
        const priceInput = form.querySelector(
          `[name="tier-price-${indexToRemove}"]`,
        );

        if (minInput) minInput.remove();
        if (maxInput) maxInput.remove();
        if (priceInput) priceInput.remove();
      }
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded-md bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Quantity-Based Pricing Tiers
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addTier}>
          Add Tier
        </Button>
      </div>
      <div
        id="price-tiers-container"
        className="space-y-4 mt-3"
        data-tier-count={tiers.length}
      >
        {tiers.map((index) => {
          const existingTier = existingTiers[index];
          return (
            <div
              key={index}
              className="grid grid-cols-3 gap-3 items-end relative bg-background p-3 rounded-md border"
            >
              {tiers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeTier(index)}
                >
                  ×
                </Button>
              )}
              <div>
                <Label htmlFor={`tier-min-${index}`}>Min Quantity</Label>
                <Input
                  id={`tier-min-${index}`}
                  name={`tier-min-${index}`}
                  type="number"
                  min="1"
                  defaultValue={
                    existingTier
                      ? existingTier.min_quantity.toString()
                      : index === 0
                        ? "1"
                        : ""
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor={`tier-max-${index}`}>Max Quantity</Label>
                <Input
                  id={`tier-max-${index}`}
                  name={`tier-max-${index}`}
                  type="number"
                  min="1"
                  defaultValue={
                    existingTier && existingTier.max_quantity
                      ? existingTier.max_quantity.toString()
                      : ""
                  }
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <Label htmlFor={`tier-price-${index}`}>
                  Price per Unit (MAD)
                </Label>
                <Input
                  id={`tier-price-${index}`}
                  name={`tier-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={
                    existingTier ? existingTier.price.toString() : ""
                  }
                  required
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground mt-3">
        Set different prices based on order quantity. Higher quantities
        typically have lower per-unit prices.
      </p>
    </div>
  );
}
