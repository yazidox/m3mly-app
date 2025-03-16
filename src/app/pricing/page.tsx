import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  X,
  Zap,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
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
              <span className="relative">TARIFICATION TRANSPARENTE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Des Plans{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Adaptés
              </span>{" "}
              à Vos Besoins
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Choisissez le plan qui correspond le mieux à vos besoins de
              production. Pas de frais cachés, juste une tarification
              transparente.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/20">
              <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-secondary/30 text-foreground text-xs font-medium">
                <span className="relative">DÉBUTANT</span>
              </div>

              <h2 className="text-3xl font-bold mb-2">Basique</h2>
              <p className="text-muted-foreground mb-6">
                Parfait pour les petites marques et les startups
              </p>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">Gratuit</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Accès au catalogue d'usines",
                  "Demandes d'échantillons",
                  "Suivi de commande basique",
                  "Support par email",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 text-primary rounded-full p-1 border border-primary/20 shadow-glow mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}

                {[
                  "Gestion de production avancée",
                  "Contrôle qualité premium",
                  "Support prioritaire",
                  "Tarifs préférentiels",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="bg-muted/30 text-muted-foreground rounded-full p-1 border border-muted/20 mt-1">
                      <X className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sign-up">
                <Button
                  variant="outline"
                  className="w-full group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Commencer Gratuitement
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 relative z-10 shadow-glow shadow-primary/10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-xl" />

              <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                <Zap className="w-3 h-3 mr-1" />
                <span className="relative">POPULAIRE</span>
              </div>

              <h2 className="text-3xl font-bold mb-2">Pro</h2>
              <p className="text-muted-foreground mb-6">
                Idéal pour les marques en croissance
              </p>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">499 MAD</span>
                <span className="text-muted-foreground ml-2">/mois</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Tout ce qui est inclus dans Basique",
                  "Gestion de production avancée",
                  "Contrôle qualité standard",
                  "Support prioritaire",
                  "Tarifs préférentiels",
                  "Rapports de production",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 text-primary rounded-full p-1 border border-primary/20 shadow-glow mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}

                {[
                  "Gestionnaire de compte dédié",
                  "Contrôle qualité premium",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="bg-muted/30 text-muted-foreground rounded-full p-1 border border-muted/20 mt-1">
                      <X className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sign-up?plan=pro">
                <Button className="w-full group relative inline-flex items-center text-white bg-primary hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    S'abonner Maintenant
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/20">
              <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />
                <span className="relative">PREMIUM</span>
              </div>

              <h2 className="text-3xl font-bold mb-2">Entreprise</h2>
              <p className="text-muted-foreground mb-6">
                Pour les marques établies avec des besoins spécifiques
              </p>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">Sur Mesure</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Tout ce qui est inclus dans Pro",
                  "Gestionnaire de compte dédié",
                  "Contrôle qualité premium",
                  "Intégration API personnalisée",
                  "Conditions de paiement flexibles",
                  "Formations et ateliers exclusifs",
                  "Accès anticipé aux nouvelles fonctionnalités",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 text-primary rounded-full p-1 border border-primary/20 shadow-glow mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact?subject=Enterprise%20Plan">
                <Button
                  variant="outline"
                  className="w-full group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Contactez-nous
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">COMPARAISON</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Comparez les Fonctionnalités
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Un aperçu détaillé de ce que chaque plan a à offrir pour vous
              aider à faire le meilleur choix.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card/50 backdrop-blur-sm rounded-xl border border-border">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="p-4 text-left font-medium">Fonctionnalité</th>
                  <th className="p-4 text-center font-medium">Basique</th>
                  <th className="p-4 text-center font-medium bg-primary/10">
                    Pro
                  </th>
                  <th className="p-4 text-center font-medium">Entreprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Accès au catalogue d'usines",
                    basic: true,
                    pro: true,
                    enterprise: true,
                  },
                  {
                    feature: "Demandes d'échantillons",
                    basic: true,
                    pro: true,
                    enterprise: true,
                  },
                  {
                    feature: "Suivi de commande",
                    basic: "Basique",
                    pro: "Avancé",
                    enterprise: "Premium",
                  },
                  {
                    feature: "Support client",
                    basic: "Email",
                    pro: "Prioritaire",
                    enterprise: "Dédié",
                  },
                  {
                    feature: "Contrôle qualité",
                    basic: false,
                    pro: "Standard",
                    enterprise: "Premium",
                  },
                  {
                    feature: "Rapports de production",
                    basic: false,
                    pro: true,
                    enterprise: true,
                  },
                  {
                    feature: "Tarifs préférentiels",
                    basic: false,
                    pro: true,
                    enterprise: true,
                  },
                  {
                    feature: "Gestionnaire de compte",
                    basic: false,
                    pro: false,
                    enterprise: true,
                  },
                  {
                    feature: "Intégration API",
                    basic: false,
                    pro: false,
                    enterprise: true,
                  },
                  {
                    feature: "Conditions de paiement flexibles",
                    basic: false,
                    pro: false,
                    enterprise: true,
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.basic === "boolean" ? (
                        row.basic ? (
                          <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        row.basic
                      )}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">FAQ</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Questions Fréquentes sur la Tarification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "Puis-je changer de plan à tout moment?",
                answer:
                  "Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous souhaitez passer à un plan inférieur, le changement prendra effet à la fin de votre cycle de facturation actuel.",
              },
              {
                question: "Y a-t-il des frais cachés?",
                answer:
                  "Non, nous croyons en la transparence totale. Les prix affichés sont les seuls que vous paierez pour l'accès à notre plateforme. Les coûts de production et d'expédition sont séparés et dépendent de vos commandes spécifiques.",
              },
              {
                question: "Comment fonctionne la facturation?",
                answer:
                  "La facturation est mensuelle ou annuelle, selon votre préférence. Pour les plans annuels, nous offrons une réduction de 15% sur le prix total.",
              },
              {
                question: "Offrez-vous une garantie de remboursement?",
                answer:
                  "Oui, nous offrons une garantie de remboursement de 14 jours. Si vous n'êtes pas satisfait de nos services, contactez-nous dans les 14 jours suivant votre abonnement pour un remboursement complet.",
              },
              {
                question: "Que comprend exactement le plan Entreprise?",
                answer:
                  "Le plan Entreprise est entièrement personnalisable selon vos besoins spécifiques. Il comprend toutes les fonctionnalités du plan Pro, plus un gestionnaire de compte dédié, des contrôles qualité premium, et des conditions de paiement flexibles. Contactez-nous pour discuter de vos besoins particuliers.",
              },
              {
                question: "Puis-je essayer avant d'acheter?",
                answer:
                  "Absolument! Notre plan Basique est gratuit et vous permet d'explorer notre plateforme et de comprendre comment nous pouvons vous aider. Vous pouvez passer à un plan payant lorsque vous êtes prêt à accéder à des fonctionnalités plus avancées.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
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
              <Star className="w-4 h-4 mr-2" />
              <span className="relative">COMMENCEZ DÈS AUJOURD'HUI</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Prêt à Transformer Votre Production Textile?
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Rejoignez des centaines de marques qui font confiance à M3mly pour
              leurs besoins de production textile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button className="group relative inline-flex items-center px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Commencer Gratuitement
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
