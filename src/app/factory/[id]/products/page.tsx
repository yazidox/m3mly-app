import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import FactoryProductsHeader from "@/components/factory/factory-products-header";
import FactoryProductsEmpty from "@/components/factory/factory-products-empty";
import FactoryProductsGrid from "@/components/factory/factory-products-grid";
import { cookies } from "next/headers";

export default async function FactoryProductsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "fr";
  const isRtl = locale === "ar";

  // Fetch factory data
  const { data: factory, error: factoryError } = await supabase
    .from("factories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (factoryError) {
    console.error("Error fetching factory:", factoryError);
    return notFound();
  }

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", params.id)
    .eq("status", "active");

  if (productsError) {
    console.error("Error fetching factory products:", productsError);
  }

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />

      <section className="relative overflow-hidden py-12">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            "absolute top-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob",
            isRtl ? "right-[-10rem]" : "left-[-10rem]"
          )} />
          <div className={cn(
            "absolute -bottom-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000",
            isRtl ? "left-20" : "right-20"
          )} />
        </div>

        <div className="container mx-auto px-4 py-8 relative">
          <FactoryProductsHeader 
            factoryId={params.id}
            factoryName={factory.name}
          />

          {products && products.length > 0 ? (
            <FactoryProductsGrid 
              products={products}
              factoryId={params.id}
            />
          ) : (
            <FactoryProductsEmpty factoryId={params.id} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
