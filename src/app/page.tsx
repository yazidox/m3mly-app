import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Factory,
  Truck,
  Scissors,
  Search,
  Filter,
  Star,
  Sparkles,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/i18n/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch featured factories from database
  const { data: featuredFactories, error: factoriesError } = await supabase
    .from("factories")
    .select("*")
    .eq("status", "approved")
    .order("rating", { ascending: false })
    .limit(3);

  if (factoriesError) {
    console.error("Error fetching featured factories:", factoriesError);
  }

  // Use empty array if no factories found
  const featuredFactoryList = featuredFactories || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-60 -right-20 w-60 h-60 bg-accent/20 rounded-full filter blur-3xl opacity-60 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-40 left-20 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-4 inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Revolutionizing Garment Manufacturing
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight">
                {t("hero.connect_with")}{" "}
                <span className="gradient-text">{t("hero.moroccan")}</span>{" "}
                {t("hero.garment_factories")}
              </h1>

              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/factories"
                  className="inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 text-lg font-medium hover-lift"
                >
                  {t("common.find_factories")}
                  <Search className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-8 py-4 text-foreground bg-secondary rounded-xl hover:bg-secondary/80 transition-all text-lg font-medium hover-lift"
                >
                  {t("common.join_as_factory")}
                  <Factory className="ml-2 w-5 h-5" />
                </Link>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t("common.no_minimum_orders")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t("common.secure_payment")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{t("common.quality_guaranteed")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factory Listings Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="text-sm font-medium text-primary mb-2">
                DISCOVER
              </div>
              <h2 className="text-4xl font-bold">Featured Factories</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <Link
                href="/factories"
                className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
              >
                View All
                <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFactoryList.map((factory, idx) => (
              <div
                key={factory.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={
                      factory.image ||
                      "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80"
                    }
                    alt={factory.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{factory.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="fill-amber-500 w-4 h-4" />
                      <span className="text-sm font-medium">
                        {factory.rating || 4.5}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {factory.location} • MOQ: {factory.min_order_quantity}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(factory.specialties || []).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/factory/${factory.id}`}
                    className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="text-sm font-medium text-primary mb-2">PROCESS</div>
            <h2 className="text-4xl font-bold mb-4">How M3mly Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the manufacturing process from design to
              delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="w-8 h-8" />,
                title: "Design & Request",
                description:
                  "Upload your designs and specify requirements. Request samples from factories that match your needs.",
              },
              {
                icon: <Factory className="w-8 h-8" />,
                title: "Production & Quality Control",
                description:
                  "Track your order through each production milestone with real-time updates and quality checks.",
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Secure Payment & Delivery",
                description:
                  "Payments are held in escrow until you approve the final product, ensuring quality and satisfaction.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full filter blur-3xl opacity-30 animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full filter blur-3xl opacity-20 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover-lift">
              <div className="text-5xl font-bold mb-2 text-white">50+</div>
              <div className="text-white/80 font-medium">
                Verified Factories
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover-lift">
              <div className="text-5xl font-bold mb-2 text-white">1,000+</div>
              <div className="text-white/80 font-medium">Orders Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover-lift">
              <div className="text-5xl font-bold mb-2 text-white">98%</div>
              <div className="text-white/80 font-medium">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto bg-card rounded-2xl p-12 border border-border shadow-xl text-center">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Join Our Network
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Clothing Business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join M3mly today and connect with the best Moroccan garment
              manufacturers.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 text-lg font-medium hover-lift"
            >
              Create Your Account
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
