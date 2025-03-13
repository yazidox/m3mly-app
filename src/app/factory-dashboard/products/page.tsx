import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function FactoryProductsPage() {
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

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", userData.factory_id)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  async function deleteProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const productId = formData.get("product_id") as string;

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
      throw new Error("Unauthorized: Only factory owners can delete products");
    }

    // Delete product
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("factory_id", userData.factory_id);

    if (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product");
    }

    return redirect("/factory-dashboard/products?message=product_deleted");
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Products</h1>
            <p className="text-muted-foreground">
              Manage your factory's product catalog
            </p>
          </div>
          <Link href="/factory-dashboard/products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Min Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image && (
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.min_order_quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "success" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/factory-dashboard/products/${product.id}`}
                        >
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deleteProduct}>
                          <input
                            type="hidden"
                            name="product_id"
                            value={product.id}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't added any products to your catalog yet. Add your
                first product to start receiving orders.
              </p>
              <Link href="/factory-dashboard/products/new">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
