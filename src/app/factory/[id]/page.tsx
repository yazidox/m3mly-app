import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Factory,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Star,
  Truck,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Scissors from "@/components/scissors";
import { t } from "@/lib/i18n/server";
import { createClient } from "../../../../supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProductCardWithAuth from "@/components/product-card-with-auth";
import FactoryHeader from "@/components/factory/factory-header";
import FactoryTabLabel from "@/components/factory/factory-tab-label";
import FactoryProducts from "@/components/factory/factory-products";
import FactoryOverview from "@/components/factory/factory-overview";
import FactoryGallery from "@/components/factory/factory-gallery";
import FactoryReviews from "@/components/factory/factory-reviews";
import FactorySampleRequest from "@/components/factory/factory-sample-request";

export default async function FactoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

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
    .eq("status", "active")
    .limit(6);

  if (productsError) {
    console.error("Error fetching factory products:", productsError);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Cover Image with Gradient Overlay */}
      <div className="relative h-72 md:h-96 w-full">
        <Image
          src={
            factory.cover_image ||
            "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=1200&q=80"
          }
          alt={factory.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Factory Header */}
        <FactoryHeader factory={factory} factoryId={params.id} />

        {/* Products Section - Featured at the top */}
        {products && products.length > 0 && (
          <FactoryProducts products={products} factoryId={params.id} />
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Factory Details */}
          <div className="flex-1">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">
                  <FactoryTabLabel label="Aperçu" arabicLabel="نظرة عامة" />
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <FactoryTabLabel label="Galerie" arabicLabel="معرض الصور" />
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <FactoryTabLabel label="Avis" arabicLabel="التقييمات" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <FactoryOverview factory={factory} />
              </TabsContent>

              <TabsContent value="gallery">
                <FactoryGallery factory={factory} />
              </TabsContent>

              <TabsContent value="reviews">
                <FactoryReviews factory={factory} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Request Sample Form */}
          <div className="lg:w-80 xl:w-96">
            <FactorySampleRequest />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

