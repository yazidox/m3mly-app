export const dynamic = "force-dynamic";

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
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ClientLanguageProviderHome from "@/components/client-language-provider-home";
import {
  HeroSection,
  FactoryListingsSection,
} from "@/components/home-sections";

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
    <ClientLanguageProviderHome>
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Factory Listings Section */}
      <FactoryListingsSection featuredFactoryList={featuredFactoryList} />

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute -bottom-20 right-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">PROCESSUS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Comment fonctionne{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                M3mly
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Notre plateforme simplifie le processus de fabrication, de la
              conception à la livraison.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                icon: <Scissors className="w-8 h-8" />,
                title: "Conception & Demande",
                description:
                  "Téléchargez vos designs et spécifiez vos exigences. Demandez des échantillons aux usines qui correspondent à vos besoins.",
              },
              {
                icon: <Factory className="w-8 h-8" />,
                title: "Production & Contrôle Qualité",
                description:
                  "Suivez votre commande à travers chaque étape de production avec des mises à jour en temps réel et des contrôles de qualité.",
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: "Paiement Sécurisé & Livraison",
                description:
                  "Les paiements sont conservés en garantie jusqu'à ce que vous approuviez le produit final, assurant qualité et satisfaction.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-primary/15 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {step.description}
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-primary/20 to-accent/20 mt-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/about"
              className="group relative inline-flex items-center px-6 py-3 text-primary bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-base font-medium border border-border overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                En savoir plus sur notre processus
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute bottom-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-20 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">NOTRE IMPACT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Notre Impact en{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Chiffres
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              M3mly transforme l'industrie textile marocaine en connectant les
              marques internationales avec des fabricants locaux de qualité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Factory className="w-10 h-10" />,
                value: "50+",
                label: "Usines Vérifiées",
                description:
                  "Partenaires de confiance rigoureusement sélectionnés pour leur excellence",
              },
              {
                icon: <ShieldCheck className="w-10 h-10" />,
                value: "1,000+",
                label: "Commandes Complétées",
                description:
                  "Projets livrés avec succès, de petites séries aux productions industrielles",
              },
              {
                icon: <Award className="w-10 h-10" />,
                value: "98%",
                label: "Satisfaction Client",
                description:
                  "Nos clients recommandent nos services pour leur qualité et fiabilité",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={cn(
                  "bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border transform transition-all duration-500",
                  "hover:scale-105 hover:shadow-xl hover:border-primary/20 flex flex-col items-center",
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-primary/15 text-primary rounded-full p-4 mb-6 border border-primary/20 shadow-glow">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 relative">
                  <span className="animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {stat.value}
                  </span>
                </div>
                <div className="font-medium mb-3 text-xl">{stat.label}</div>
                <div className="text-muted-foreground text-sm text-center">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/about"
              className="group relative inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                En savoir plus sur notre impact
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
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
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="text-left max-w-2xl">
              <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="relative">Commandez depuis chez vous</span>
              </div>

              <h2 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
                Prêt à commander des{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                  vêtements
                </span>{" "}
                de qualité à prix bas?
              </h2>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Rejoignez M3mly aujourd'hui et accédez aux meilleurs fabricants
                marocains pour des vêtements de qualité à des prix imbattables,
                livrés directement chez vous.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <Link
                  href="/sign-up"
                  className="group relative inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Commander maintenant
                    <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <Link
                  href="/about"
                  className="group relative inline-flex items-center px-8 py-4 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-lg font-medium border border-border overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Voir les échantillons
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-md">
              <div className="relative z-10 bg-card rounded-2xl overflow-hidden border border-border/50 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
                <div className="p-2">
                  <Image
                    src="/images/factory-showcase.jpg"
                    alt="Vêtements de qualité à prix bas"
                    width={500}
                    height={350}
                    className="rounded-xl object-cover w-full h-[350px]"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/20 backdrop-blur-sm p-1.5 rounded-full">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      Qualité garantie
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1">
                    De l'usine à votre garde-robe
                  </h3>
                  <p className="text-white/80 text-sm">
                    Sans intermédiaires, à prix imbattables
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 border border-border shadow-lg z-20 backdrop-blur-sm transform hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-sm font-medium">
                      Échantillons disponibles
                    </div>
                    <div className="text-xs text-muted-foreground">
                      testez avant de commander
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </ClientLanguageProviderHome>
  );
}
