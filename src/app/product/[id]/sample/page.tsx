import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { requestSample } from "@/app/actions/products";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SampleRequestForm } from "@/components/sample-request-form";

export default async function RequestSamplePage({
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
    return redirect(`/sign-in?redirect_to=/product/${params.id}/sample`);
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
                {(product.features || []).map((feature: string, index: number) => (
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

          {/* Sample Request Form */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Request Sample</h2>
                <p className="text-muted-foreground">
                  Get a sample of this product before placing a bulk order
                </p>
              </div>
            </div>

            <SampleRequestForm 
              product={product} 
              userData={userData} 
              requestSample={requestSample} 
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
