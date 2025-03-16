import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PriceTiersContainer } from "@/components/price-tiers-container";

export default async function NewProductPage() {
  const supabase = await createClient();

  const { data: factories, error } = await supabase
    .from("factories")
    .select("id, name")
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Error fetching factories:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
          <p className="text-muted-foreground">Create a new factory product</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <form action={createProduct} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="factory_id">Factory</Label>
              <select
                id="factory_id"
                name="factory_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a factory</option>
                {factories?.map((factory) => (
                  <option key={factory.id} value={factory.id}>
                    {factory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (MAD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required />
              </div>
            </div>

            {/* Price Tiers */}
            <PriceTiersContainer initialTierCount={1} />

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                name="features"
                placeholder="Organic cotton, Sustainable, Handmade"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_quantity">
                  Minimum Order Quantity
                </Label>
                <Input
                  id="min_order_quantity"
                  name="min_order_quantity"
                  type="number"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_time">Lead Time (days)</Label>
                <Input
                  id="lead_time"
                  name="lead_time"
                  type="number"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="active"
                required
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Product
          </Button>
        </form>
      </div>
    </div>
  );
}
