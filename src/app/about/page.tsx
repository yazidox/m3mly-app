import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Building,
  Award,
  Zap,
  Heart,
  Globe,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
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
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">Notre Histoire</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              À Propos de{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                M3mly
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Nous connectons les marques de vêtements avec les meilleurs
              fabricants marocains pour une production de qualité à des prix
              compétitifs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-xl">
                <Image
                  src="/images/factory-showcase.jpg"
                  alt="Notre mission"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div>
              <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="relative">NOTRE MISSION</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Révolutionner l'industrie textile marocaine
              </h2>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Notre mission est de connecter les marques internationales avec
                les meilleurs fabricants marocains, en simplifiant le processus
                de production et en garantissant des produits de qualité à des
                prix compétitifs.
              </p>

              <div className="space-y-4">
                {[
                  "Faciliter l'accès aux usines de confection marocaines",
                  "Garantir la qualité et la transparence à chaque étape",
                  "Soutenir l'économie locale et les artisans marocains",
                  "Offrir des prix compétitifs sans compromettre la qualité",
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 text-primary rounded-full p-1 border border-primary/20 shadow-glow mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">NOS VALEURS</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Les principes qui guident nos actions
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Nos valeurs fondamentales définissent notre approche et notre
              engagement envers nos clients et partenaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="h-10 w-10" />,
                title: "Qualité & Excellence",
                description:
                  "Nous nous engageons à maintenir les plus hauts standards de qualité dans tous nos services et produits.",
              },
              {
                icon: <Heart className="h-10 w-10" />,
                title: "Intégrité & Transparence",
                description:
                  "Nous croyons en l'honnêteté et la transparence dans toutes nos interactions avec nos clients et partenaires.",
              },
              {
                icon: <Globe className="h-10 w-10" />,
                title: "Durabilité & Responsabilité",
                description:
                  "Nous nous efforçons de promouvoir des pratiques durables et responsables dans l'industrie textile.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/20"
              >
                <div className="bg-primary/15 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto border border-primary/20 shadow-glow">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">NOTRE ÉQUIPE</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Rencontrez les visionnaires derrière M3mly
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Notre équipe diversifiée et passionnée travaille sans relâche pour
              révolutionner l'industrie textile marocaine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mohammed Alami",
                role: "Fondateur & CEO",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed",
                bio: "Expert en textile avec plus de 15 ans d'expérience dans l'industrie marocaine.",
              },
              {
                name: "Leila Benkirane",
                role: "Directrice des Opérations",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=leila",
                bio: "Spécialiste en gestion de la chaîne d'approvisionnement et en optimisation des processus de production.",
              },
              {
                name: "Youssef Tazi",
                role: "Responsable Technologie",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=youssef",
                bio: "Ingénieur en logiciel passionné par l'innovation technologique dans le secteur textile.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/20 text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">REJOIGNEZ-NOUS</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Prêt à transformer votre production textile?
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Que vous soyez une marque à la recherche de fabricants de qualité
              ou une usine souhaitant élargir votre clientèle, M3mly est là pour
              vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button className="group relative inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Créer un compte
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="group relative inline-flex items-center px-8 py-4 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-lg font-medium border border-border overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Contactez-nous
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
