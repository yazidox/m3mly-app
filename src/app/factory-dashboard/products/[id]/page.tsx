import { createClient } from "../../../../../supabase/server";
import { redirect, notFound } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function EditFactoryProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/products");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("*, factories(*)")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    return redirect("/dashboard?error=not_factory_owner");
  }

  // Fetch product data
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (productError || !product) {
    console.error("Error fetching product:", productError);
    return notFound();
  }

  async function updateProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();

    // Get user information
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Check if user is a factory owner
    const { data: userData } = await supabase
      .from("users")
      .select("role, factory_id")
      .eq("id", user.id)
      .single();

    if (
      !userData ||
      userData.role !== "factory_owner" ||
      !userData.factory_id
    ) {
      throw new Error("Unauthorized: Only factory owners can update products");
    }

    // Extract form data
    const productId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const features = (formData.get("features") as string)
      .split(",")
      .map((f) => f.trim());
    const minOrderQuantity = parseInt(
      formData.get("min_order_quantity") as string,
    );
    const leadTime = parseInt(formData.get("lead_time") as string);
    const status = formData.get("status") as string;

    // Update product in database
    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        category,
        description,
        image,
        features,
        min_order_quantity: minOrderQuantity,
        lead_time: leadTime,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .eq("factory_id", userData.factory_id);

    if (error) {
      console.error("Error updating product:", error);
      throw new Error("Failed to update product");
    }

    return redirect("/factory-dashboard/products?message=product_updated");
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/factory-dashboard/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">
              Update your product information
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
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
    </div>
  );
}
