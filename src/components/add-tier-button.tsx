"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AddTierButtonProps {
  initialTierCount?: number;
}

export function AddTierButton({ initialTierCount = 0 }: AddTierButtonProps) {
  const [tierCount, setTierCount] = useState(initialTierCount);

  useEffect(() => {
    // Initialize the first tier if initialTierCount is provided
    if (initialTierCount > 0) {
      setTierCount(initialTierCount);
    }
  }, [initialTierCount]);

  const handleAddTier = () => {
    const tiersContainer = document.getElementById("price-tiers-container");
    if (!tiersContainer) return;

    const newTierCount = tierCount + 1;
    setTierCount(newTierCount);

    const newTier = document.createElement("div");
    newTier.className = "grid grid-cols-3 gap-2 mt-2 items-end";
    newTier.innerHTML = `
      <div>
        <label for="tier-min-${newTierCount}" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Min Quantity</label>
        <input id="tier-min-${newTierCount}" name="tier-min-${newTierCount}" type="number" min="1" required class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
      </div>
      <div>
        <label for="tier-max-${newTierCount}" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Max Quantity</label>
        <input id="tier-max-${newTierCount}" name="tier-max-${newTierCount}" type="number" min="1" placeholder="Leave empty for unlimited" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
      </div>
      <div>
        <label for="tier-price-${newTierCount}" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Price per Unit ($)</label>
        <input id="tier-price-${newTierCount}" name="tier-price-${newTierCount}" type="number" min="0" step="0.01" required class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
      </div>
    `;

    tiersContainer.appendChild(newTier);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleAddTier}>
      Add Tier
    </Button>
  );
}
