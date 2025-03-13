import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShoppingCart, Upload } from "lucide-react";
import dynamic from "next/dynamic";

const FileUploadButton = dynamic(
  () => import("@/components/file-upload-button"),
  { ssr: false },
);
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { placeOrder } from "@/app/actions/products";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function PlaceOrderPage({
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
    return redirect(`/sign-in?redirect_to=/product/${params.id}/order`);
  }

  // Fetch product data
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, factories(name, location)")
    .eq("id", params.id)
    .single();

  if (productError || !product) {
    console.error("Error fetching product:", productError);
    return notFound();
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/factory/${product.factory_id}/products`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">
                From {product.factories?.name} • {product.factories?.location}
              </p>
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold text-primary">
                  ${product.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  MOQ: {product.min_order_quantity}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(product.features || []).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Place Order</h2>
                <p className="text-muted-foreground">
                  Fill out the form below to place your bulk order
                </p>
              </div>
            </div>

            <form action={placeOrder} className="space-y-6">
              <input type="hidden" name="product_id" value={product.id} />
              <input
                type="hidden"
                name="factory_id"
                value={product.factory_id}
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      defaultValue={userData?.full_name || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={userData?.email || ""}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={userData?.phone || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" name="company" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_address">Shipping Address</Label>
                  <Textarea
                    id="shipping_address"
                    name="shipping_address"
                    rows={3}
                    defaultValue={userData?.address || ""}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Order Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={product.min_order_quantity}
                      defaultValue={product.min_order_quantity}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" name="color" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input id="size" name="size" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" name="material" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="design_files">Design Files</Label>
                  <div className="border border-dashed border-border rounded-md p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your design files here, or click to browse
                    </p>
                    <Input
                      id="design_files"
                      name="design_files"
                      type="file"
                      className="hidden"
                      multiple
                    />
                    <FileUploadButton inputId="design_files" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: AI, PSD, PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any specific requirements or instructions for your order"
                    rows={4}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Place Order
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing this order, you agree to our terms and conditions. A
                deposit may be required before production begins.
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
