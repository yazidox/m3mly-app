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
        <div className="bg-card rounded-xl border border-border p-6 -mt-24 relative z-10 mb-8 backdrop-blur-sm shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative h-28 w-28 rounded-xl overflow-hidden border-4 border-background shadow-lg">
              <Image
                src={
                  factory.image ||
                  "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80"
                }
                alt={factory.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1 tracking-tight">{factory.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star
                        className="fill-amber-500 text-amber-500"
                        size={16}
                      />
                      <span>
                        {factory.rating || 4.5} ({factory.review_count || 0}{" "}
                        avis)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/factory/${params.id}/products`}>
                    <Button className="flex items-center gap-2">
                      <Package size={16} />
                      <span>Voir tous les produits</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section - Featured at the top */}
        {products && products.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Produits disponibles
              </h2>
              <Link
                href={`/factory/${params.id}/products`}
                className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
              >
                <span>Voir tous les produits</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all bg-card/50"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.price} MAD
                    </p>
                    <Link
                      href={`/factory/${params.id}/products`}
                      className="text-primary hover:underline text-xs flex items-center gap-1"
                    >
                      <span>Voir détails</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Factory Details */}
          <div className="flex-1">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    À propos de {factory.name}
                  </h2>
                  <p className="text-muted-foreground mb-6">{factory.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Spécialités</h3>
                      <div className="flex flex-wrap gap-2">
                        {(factory.specialties || []).map((specialty: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(factory.certifications || []).map((cert: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-accent/15 text-accent rounded-full text-sm flex items-center gap-1"
                          >
                            <CheckCircle2 size={14} />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Détails de production
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Package size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Commande minimum</h3>
                        <p className="text-muted-foreground">
                          {factory.min_order_quantity} unités
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Délai de production</h3>
                        <p className="text-muted-foreground">{factory.lead_time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 text-primary rounded-lg">
                        <Factory size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Capacité de production</h3>
                        <p className="text-muted-foreground">{factory.capacity}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Services proposés
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Scissors size={18} />,
                        service: "Création de patrons",
                      },
                      {
                        icon: <FileText size={18} />,
                        service: "Développement d'échantillons",
                      },
                      {
                        icon: <Users size={18} />,
                        service: "Production en petite série",
                      },
                      {
                        icon: <Factory size={18} />,
                        service: "Production de masse",
                      },
                      { icon: <Package size={18} />, service: "Emballage" },
                      {
                        icon: <Truck size={18} />,
                        service: "Expédition & Logistique",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="text-primary">{item.icon}</div>
                        <span>{item.service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Galerie de l'usine
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(
                      factory.gallery || [
                        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
                        "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=600&q=80",
                        "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=600&q=80",
                        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
                        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
                      ]
                    ).map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden border border-border group"
                      >
                        <Image
                          src={image}
                          alt={`Image de galerie ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Avis clients</h2>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="fill-amber-500" size={18} />
                      <span className="font-medium">
                        {factory.rating || 4.5}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({factory.review_count || 0})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {(
                      factory.reviews || [
                        {
                          id: 1,
                          author: "Sarah Johnson",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                          rating: 5,
                          date: "15/10/2023",
                          comment:
                            "Excellente qualité et communication. Notre commande a été livrée à temps et a dépassé nos attentes. Nous travaillerons certainement à nouveau avec eux.",
                        },
                        {
                          id: 2,
                          author: "Michel Dupont",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                          rating: 4,
                          date: "22/09/2023",
                          comment:
                            "Bonne expérience dans l'ensemble. Les produits étaient bien fabriqués, bien qu'il y ait eu un léger retard dans l'expédition. La communication était excellente tout au long du processus.",
                        },
                        {
                          id: 3,
                          author: "Emma Rodriguez",
                          avatar:
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
                          rating: 5,
                          date: "30/08/2023",
                          comment:
                            "Incroyable attention aux détails. Nos designs personnalisés ont été parfaitement exécutés, et l'usine a été très accommodante avec nos révisions.",
                        },
                      ]
                    ).map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={review.avatar}
                              alt={review.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{review.author}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={14}
                                        className={
                                          i < review.rating
                                            ? "fill-amber-500 text-amber-500"
                                            : "text-muted-foreground/30"
                                        }
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{review.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="mt-4 w-full">
                    Voir tous les avis
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Request Sample Form */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 shadow-sm">
              <div className="mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="relative">ÉCHANTILLONS</span>
              </div>
              <h2 className="text-xl font-semibold mb-4">Demander un échantillon</h2>
              <p className="text-muted-foreground mb-6">
                Obtenez un échantillon de votre design avant de passer une commande en gros
              </p>

              <Button className="w-full mb-4">Demander un échantillon</Button>
              <Button variant="outline" className="w-full">
                Passer une commande
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
