import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
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
              <span className="relative">CONTACTEZ-NOUS</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Nous Sommes Là Pour{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Vous Aider
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Des questions, des commentaires ou des préoccupations? Notre
              équipe est prête à vous aider. Contactez-nous dès aujourd'hui.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
              <h2 className="text-2xl font-bold mb-6">
                Envoyez-nous un message
              </h2>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    placeholder="Comment pouvons-nous vous aider?"
                    className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Votre message ici..."
                    rows={6}
                    className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <Button className="group relative inline-flex items-center px-6 py-3 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden w-full">
                  <span className="relative z-10 flex items-center justify-center">
                    Envoyer le Message
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/15 text-primary p-3 rounded-full border border-primary/20 shadow-glow">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground mb-1">
                        Pour les demandes générales:
                      </p>
                      <a
                        href="mailto:info@m3mly.com"
                        className="text-primary hover:underline"
                      >
                        info@m3mly.com
                      </a>
                      <p className="text-muted-foreground mt-2 mb-1">
                        Pour le support:
                      </p>
                      <a
                        href="mailto:support@m3mly.com"
                        className="text-primary hover:underline"
                      >
                        support@m3mly.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/15 text-primary p-3 rounded-full border border-primary/20 shadow-glow">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                      <p className="text-muted-foreground mb-1">
                        Bureau principal:
                      </p>
                      <a
                        href="tel:+212522123456"
                        className="text-primary hover:underline"
                      >
                        +212 522 123 456
                      </a>
                      <p className="text-muted-foreground mt-2 mb-1">
                        Support client:
                      </p>
                      <a
                        href="tel:+212522789012"
                        className="text-primary hover:underline"
                      >
                        +212 522 789 012
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/15 text-primary p-3 rounded-full border border-primary/20 shadow-glow">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Adresse</h3>
                      <p className="text-muted-foreground mb-2">
                        Siège social:
                      </p>
                      <p>123 Boulevard Mohammed V</p>
                      <p>Casablanca, 20250</p>
                      <p>Maroc</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                <h2 className="text-2xl font-bold mb-6">Heures d'Ouverture</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="font-medium">Samedi</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">FAQ</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Questions Fréquemment Posées
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Trouvez rapidement des réponses aux questions les plus courantes
              sur nos services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "Comment fonctionne le processus de commande?",
                answer:
                  "Notre processus de commande est simple: parcourez nos usines partenaires, sélectionnez celle qui correspond à vos besoins, demandez un devis ou un échantillon, puis passez votre commande. Nous nous occupons du reste, de la production à la livraison.",
              },
              {
                question: "Quels sont les délais de production moyens?",
                answer:
                  "Les délais de production varient en fonction du type de produit et de la quantité commandée. En général, comptez entre 2 et 4 semaines pour la production, plus le temps de livraison. Chaque usine affiche ses délais de production estimés sur son profil.",
              },
              {
                question: "Comment puis-je suivre ma commande?",
                answer:
                  "Une fois votre commande confirmée, vous recevrez un accès à notre tableau de bord où vous pourrez suivre l'état de votre commande en temps réel, de la production à la livraison.",
              },
              {
                question: "Quelles sont les quantités minimales de commande?",
                answer:
                  "Les quantités minimales de commande varient selon les usines et les produits. Certaines usines acceptent des commandes à partir de 50 pièces, tandis que d'autres peuvent exiger des quantités plus importantes. Ces informations sont clairement indiquées sur chaque profil d'usine.",
              },
              {
                question: "Comment fonctionne le processus d'échantillonnage?",
                answer:
                  "Vous pouvez demander des échantillons avant de passer une commande en gros. Les frais d'échantillonnage varient selon le produit et l'usine. Une fois approuvés, ces frais peuvent être déduits de votre commande finale.",
              },
              {
                question: "Quelles sont les options de paiement disponibles?",
                answer:
                  "Nous acceptons plusieurs méthodes de paiement, notamment les virements bancaires et les paiements par WafaCash. Pour les commandes importantes, nous proposons généralement un paiement échelonné: un acompte initial, puis le solde avant l'expédition.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20"
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Vous ne trouvez pas la réponse que vous cherchez?
            </p>
            <Button className="group relative inline-flex items-center px-6 py-3 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden">
              <span className="relative z-10 flex items-center">
                Contactez notre équipe support
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
