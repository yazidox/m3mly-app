import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function NewFactoryProductPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/products/new");
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

  async function createProduct(formData: FormData) {
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
      throw new Error("Unauthorized: Only factory owners can create products");
    }

    // Extract form data
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

    // Create product in database
    const { error } = await supabase.from("products").insert({
      factory_id: userData.factory_id,
      name,
      price,
      category,
      description,
      image,
      features,
      min_order_quantity: minOrderQuantity,
      lead_time: leadTime,
      status,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }

    return redirect("/factory-dashboard?tab=products&message=product_created");
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/factory-dashboard?tab=products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product for your factory catalog
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <form action={createProduct} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" required />
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                />
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
    </div>
  );
}
