import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { OrderRequestForm } from "@/components/order-request-form";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { placeOrder } from "@/app/actions/products";
import { createClient } from "../../../../../supabase/server";
import Navbar from "@/components/navbar";
import { ProductDisplay } from "@/components/product-display";
import Footer from "@/components/footer";
import { ProductPriceCalculator } from "@/components/product-price-calculator";

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
          Retour aux Produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Information */}
          <ProductDisplay product={product} />

          {/* Order Form */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Passer Commande</h2>
                <p className="text-muted-foreground">
                  Remplissez le formulaire ci-dessous pour passer votre commande
                  en gros
                </p>
              </div>
            </div>

            {/* Add price calculator before the order form */}
            {product.price_tiers && product.price_tiers.length > 0 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-medium mb-3">
                  Calculateur de prix (Prix réduit pour grandes quantités)
                </h3>
                <ProductPriceCalculator
                  basePrice={product.price}
                  priceTiers={product.price_tiers}
                  minOrderQuantity={product.min_order_quantity}
                  initialQuantity={product.min_order_quantity}
                />
              </div>
            )}

            <OrderRequestForm
              product={product}
              userData={userData}
              placeOrder={placeOrder}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
