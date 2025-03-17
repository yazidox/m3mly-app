import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
              <Shield className="w-4 h-4 mr-2" />
              <span className="relative">DOCUMENT LÉGAL</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Politique de <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">Confidentialité</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Dernière mise à jour: 1 Juillet 2023
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
            
            <p className="text-muted-foreground mb-4">
              Chez M3mly ("nous", "notre", "nos"), nous nous engageons à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous visitez notre site web à l'adresse www.m3mly.com (le "Site") et utilisez nos services.
            </p>
            
            <p className="text-muted-foreground mb-4">
              En accédant à notre Site et en utilisant nos services, vous consentez aux pratiques décrites dans cette Politique de Confidentialité. Si vous n'acceptez pas cette Politique, veuillez ne pas utiliser notre Site ou nos services.
            </p>
            
            <p className="text-muted-foreground">
              Nous nous réservons le droit de modifier cette Politique à tout moment. Toute modification entrera en vigueur immédiatement après sa publication sur le Site. Votre utilisation continue du Site après la publication des modifications constitue votre acceptation de la Politique modifiée.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">2. Informations que Nous Collectons</h2>
            
            <p className="text-muted-foreground mb-4">
              Nous collectons plusieurs types d'informations auprès de nos utilisateurs, notamment:
            </p>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Informations Personnelles</h3>
            <p className="text-muted-foreground mb-4">
              Lorsque vous créez un compte, passez une commande ou communiquez avec nous, nous pouvons collecter les informations suivantes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse postale</li>
              <li>Informations de paiement</li>
              <li>Nom de l'entreprise (le cas échéant)</li>
              <li>Numéro d'identification fiscale (le cas échéant)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">2.2 Informations d'Utilisation</h3>
            <p className="text-muted-foreground mb-4">
              Nous collectons également des informations sur la façon dont vous interagissez avec notre Site, notamment:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Adresse IP</li>
              <li>Type de navigateur et version</li>
              <li>Type d'appareil et système d'exploitation</li>
              <li>Pages visitées et temps passé sur ces pages</li>
              <li>Heure et date de votre visite</li>
              <li>Parcours de navigation sur notre Site</li>
              <li>Autres statistiques d'utilisation</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3">2.3 Cookies et Technologies Similaires</h3>
            <p className="text-muted-foreground">
              Nous utilisons des cookies et des technologies similaires pour collecter des informations sur votre activité, votre navigateur et votre appareil. Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur. Pour plus d'informations, veuillez consulter notre Politique relative aux Cookies.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">3. Comment Nous Utilisons Vos Informations</h2>
            
            <p className="text-muted-foreground mb-4">
              Nous utilisons les informations que nous collectons pour:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Fournir, maintenir et améliorer nos services</li>
              <li>Traiter vos commandes et transactions</li>
              <li>Communiquer avec vous concernant votre compte, vos commandes et nos services</li>
              <li>Vous envoyer des mises à jour, des alertes de sécurité et des messages de support</li>
              <li>Répondre à vos commentaires, questions et demandes</li>
              <li>Surveiller et analyser les tendances, l'utilisation et les activités liées à notre Site</li>
              <li>Détecter, prévenir et résoudre les problèmes techniques et de sécurité</li>
              <li>Personnaliser votre expérience sur notre Site</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              <li>Se conformer aux obligations légales</li>
            </ul>
            
            <p className="text-muted-foreground">
              Nous ne vendrons pas vos informations personnelles à des tiers à des fins de marketing direct sans votre consentement explicite.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">4. Partage de Vos Informations</h2>
            
            <p className="text-muted-foreground mb-4">
              Nous pouvons partager vos informations personnelles avec:
            </p>
            
            <h3 className="text-xl font-semibold mb-3">4.1 Partenaires de Service</h3>
            <p className="text-muted-foreground mb-4">
              Nous partageons des informations avec des fabricants et des fournisseurs de services tiers qui exécutent des services en notre nom, tels que le traitement des paiements, la livraison des commandes, l'analyse des données, le support client, et le marketing par email.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">4.2 Exigences Légales</h3>
            <p className="text-muted-foreground mb-4">
              Nous pouvons divulguer vos informations si la loi l'exige ou en réponse à des demandes légales valides, telles que des assignations à comparaître, des ordonnances judiciaires ou des mandats.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">4.3 Protection des Droits</h3>
            <p className="text-muted-foreground mb-4">
              Nous pouvons divulguer des informations pour protéger nos droits, notre propriété ou notre sécurité, ainsi que ceux de nos utilisateurs ou d'autres personnes.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">4.4 Transferts d'Entreprise</h3>
            <p className="text-muted-foreground">
              En cas de fusion, acquisition, réorganisation, faillite ou autre vente de tout ou partie de nos actifs, vos informations personnelles peuvent faire partie des actifs transférés.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">5. Sécurité des Données</h2>
            
            <p className="text-muted-foreground mb-4">
              Nous prenons la sécurité de vos informations personnelles très au sérieux et mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations contre la perte, l'accès non autorisé, la divulgation, l'altération et la destruction.
            </p>
            
            <p className="text-muted-foreground mb-4">
              Cependant, aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est 100% sécurisée. Par conséquent, bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos informations personnelles, nous ne pouvons garantir leur sécurité absolue.
            </p>
            
            <p className="text-muted-foreground">
              Il est important que vous preniez également des précautions pour protéger vos informations personnelles, notamment en gardant confidentiels vos identifiants de compte et en vous déconnectant lorsque vous avez fini d'utiliser un ordinateur partagé.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">6. Vos Droits</h2>
            
            <p className="text-muted-foreground mb-4">
              Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos informations personnelles, notamment:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>Le droit d'accéder à vos informations personnelles</li>
              <li>Le droit de rectifier des informations inexactes</li>
              <li>Le droit de supprimer vos informations personnelles</li>
              <li>Le droit de restreindre le traitement de vos informations</li>
              <li>Le droit à la portabilité des données</li>
              <li>Le droit de vous opposer au traitement de vos informations</li>
              <li>Le droit de retirer votre consentement à tout moment</li>
              <li>Le droit de déposer une plainte auprès d'une autorité de protection des données</li>
            </ul>
            
            <p className="text-muted-foreground">
              Pour exercer ces droits, veuillez nous contacter en utilisant les coordonnées fournies à la fin de cette Politique.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">7. Conservation des Données</h2>
            
            <p className="text-muted-foreground">
              Nous conserverons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette Politique, à moins qu'une période de conservation plus longue ne soit requise ou permise par la loi. Lorsque nous n'avons plus besoin de traiter vos informations personnelles, nous les supprimerons de nos systèmes ou les anonymiserons de manière à ce que vous ne puissiez plus être identifié.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">8. Transferts Internationaux</h2>
            
            <p className="text-muted-foreground">
              Vos informations personnelles peuvent être transférées et traitées dans des pays autres que celui dans lequel vous résidez. Ces pays peuvent avoir des lois de protection des données différentes de celles de votre pays. Si nous transférons vos informations personnelles à d'autres pays, nous prendrons des mesures appropriées pour protéger vos informations conformément à cette Politique et aux lois applicables.
            </p>
          </div>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">9. Nous Contacter</h2>
            
            <p className="text-muted-foreground mb-6">
              Si vous avez des questions, des préoccupations ou des demandes concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à:
            </p>
            
            <div className="bg-secondary/50 p-6 rounded-lg border border-border/50 mb-6">
              <p className="font-medium mb-2">M3mly</p>
              <p className="text-muted-foreground mb-1">Email: privacy@m3mly.com</p>
              <p className="text-muted-foreground mb-1">Téléphone: +212 522 123 456</p>
              <p className="text-muted-foreground">Adresse: 123 Avenue Mohammed V, Casablanca, Maroc</p>
            </div>
            
            <p className="text-muted-foreground">
              Nous nous efforcerons de répondre à votre demande dans les meilleurs délais et conformément aux lois applicables.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Des Questions sur Notre Politique?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Notre équipe est disponible pour répondre à toutes vos questions concernant la confidentialité et la protection de vos données.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/contact">
                  Contactez-Nous
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  Retour à l'Accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}