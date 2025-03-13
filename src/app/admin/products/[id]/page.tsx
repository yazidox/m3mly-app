import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return notFound();
  }

  const { data: factories } = await supabase
    .from("factories")
    .select("id, name")
    .eq("status", "approved")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        {product.image && (
          <div className="mb-6 flex justify-center">
            <div className="relative h-40 w-40 rounded-md overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <form action={updateProduct} className="space-y-6 max-w-2xl mx-auto">
          <input type="hidden" name="id" value={product.id} />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="factory_id">Factory</Label>
              <select
                id="factory_id"
                name="factory_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={product.factory_id}
                required
              >
                {factories?.map((factory) => (
                  <option key={factory.id} value={factory.id}>
                    {factory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product.name}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={product.category}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product.description}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={product.image}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma separated)</Label>
              <Input
                id="features"
                name="features"
                defaultValue={
                  product.features ? product.features.join(", ") : ""
                }
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
                  defaultValue={product.min_order_quantity}
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
                  defaultValue={product.lead_time}
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
                defaultValue={product.status}
                required
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Update Product
          </Button>
        </form>
      </div>
    </div>
  );
}
