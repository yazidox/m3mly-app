import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Factory,
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

  // Mock categories for filter
  const categories = [
    "T-shirts",
    "Dresses",
    "Activewear",
    "Denim",
    "Outerwear",
    "Knitwear",
    "Formal wear",
    "Traditional clothing",
    "Accessories",
    "Casual wear",
    "Sportswear",
    "Uniforms",
    "Sustainable clothing",
    "Beachwear",
    "Resort clothing",
    "Swimwear",
  ];

  // Mock locations for filter
  const locations = [
    "Casablanca",
    "Marrakech",
    "Fes",
    "Tangier",
    "Rabat",
    "Agadir",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header with background gradient */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-10 right-20 w-40 h-40 bg-accent/10 rounded-full filter blur-3xl opacity-40 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Find Your Perfect Manufacturing Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse Factories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover and connect with the best garment manufacturers in
              Morocco, filtered to match your specific production needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-muted-foreground">
            Showing {factoryList.length} factories
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search factories..."
                className="pl-10 w-64 bg-card border-border"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span>Sort</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-card p-6 rounded-xl border border-border h-fit sticky top-24 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span>Filters</span>
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Categories
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
                Show more
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Location
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
                Minimum Order Quantity
              </h3>
              <div className="space-y-2">
                {["1-50", "51-100", "101-200", "201+"].map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`moq-${index}`} />
                    <Label
                      htmlFor={`moq-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {range} units
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                Rating
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
                Reset
              </Button>
              <Button className="flex-1">Apply</Button>
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
                  <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
                    <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Factories Found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      There are currently no factories available that match your
                      criteria. Try adjusting your filters or check back later.
                    </p>
                    <Button variant="outline">Reset Filters</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="mx-auto hover-lift px-8">
                Load More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
