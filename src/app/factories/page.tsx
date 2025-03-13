import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Factory,
  ArrowRight,
} from "lucide-react";
import { createClient } from "../../../supabase/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FactoryCard from "@/components/factory-card";

export default async function FactoriesPage() {
  // Fetch factories from database
  const supabase = await createClient();
  const { data: factories, error } = await supabase
    .from("factories")
    .select("*")
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Error fetching factories:", error);
  }

  // Use empty array if no factories found
  const factoryList = factories || [];

  // Catégories pour le filtre
  const categories = [
    "T-shirts",
    "Robes",
    "Vêtements de sport",
    "Denim",
    "Vêtements d'extérieur",
    "Tricots",
    "Tenues formelles",
    "Vêtements traditionnels",
    "Accessoires",
    "Vêtements décontractés",
    "Sportswear",
    "Uniformes",
    "Vêtements durables",
    "Vêtements de plage",
    "Vêtements de villégiature",
    "Maillots de bain",
  ];

  // Emplacements pour le filtre
  const locations = [
    "Casablanca",
    "Marrakech",
    "Fès",
    "Tanger",
    "Rabat",
    "Agadir",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-40 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">Trouvez votre partenaire de fabrication idéal</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Explorez nos{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                usines
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              Découvrez et connectez-vous avec les meilleurs fabricants de vêtements au Maroc, 
              filtrés pour répondre à vos besoins spécifiques de production.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-muted-foreground">
            Affichage de {factoryList.length} usines
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Rechercher des usines..."
                className="pl-10 w-64 bg-card border-border"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span>Trier</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres Sidebar */}
          <div className="w-full md:w-64 bg-card p-6 rounded-xl border border-border h-fit sticky top-24 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span>Filtres</span>
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Catégories
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.slice(0, 8).map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`category-${index}`} />
                    <Label
                      htmlFor={`category-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="text-xs p-0 h-auto mt-2 text-primary"
              >
                Voir plus
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Emplacement
              </h3>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`location-${index}`} />
                    <Label
                      htmlFor={`location-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Quantité minimale de commande
              </h3>
              <div className="space-y-2">
                {["1-50", "51-100", "101-200", "201+"].map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`moq-${index}`} />
                    <Label
                      htmlFor={`moq-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {range} unités
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Évaluation
              </h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox id={`rating-${rating}`} />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="text-sm flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {rating}+{" "}
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Réinitialiser
              </Button>
              <Button className="flex-1">Appliquer</Button>
            </div>
          </div>

          {/* Factory Listings */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {factoryList.length > 0 ? (
                factoryList.map((factory, idx) => (
                  <div
                    key={factory.id}
                    className="animate-in fade-in duration-500"
                    style={{
                      animationDelay: `${idx * 50}ms`,
                    }}
                  >
                    <FactoryCard
                      factory={{
                        id: factory.id,
                        name: factory.name,
                        location: factory.location,
                        minOrderQuantity: factory.min_order_quantity,
                        rating: factory.rating || 4.5,
                        image:
                          factory.image ||
                          "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80",
                        specialties: factory.specialties || [],
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-border/50">
                    <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Aucune usine trouvée
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Il n'y a actuellement aucune usine disponible correspondant à vos critères. 
                      Essayez d'ajuster vos filtres ou revenez plus tard.
                    </p>
                    <Button 
                      variant="outline" 
                      className="group relative inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-secondary/80 transition-all"
                    >
                      <span className="relative z-10 flex items-center">
                        Réinitialiser les filtres
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center">
              <Button 
                variant="outline" 
                className="group relative inline-flex items-center px-8 py-4 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-lg font-medium border border-border overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Charger plus
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
