import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
              <span className="relative">DOCUMENT LÉGAL</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Conditions{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Générales
              </span>{" "}
              d'Utilisation
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Dernière mise à jour: 1 Juillet 2023
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>

            <p className="text-muted-foreground mb-4">
              Bienvenue sur M3mly ("nous", "notre", "nos"). En accédant à notre
              site web à l'adresse www.m3mly.com (le "Site") et en utilisant nos
              services, vous acceptez d'être lié par les présentes Conditions
              Générales d'Utilisation ("Conditions"), notre Politique de
              Confidentialité, et toutes les autres directives ou politiques
              référencées ici, qui sont incorporées par référence.
            </p>

            <p className="text-muted-foreground mb-4">
              Veuillez lire attentivement ces Conditions. Si vous n'acceptez pas
              ces Conditions, vous ne devez pas accéder ou utiliser notre Site
              ou nos services. L'utilisation de notre Site ou de nos services
              constitue votre acceptation de ces Conditions.
            </p>

            <p className="text-muted-foreground">
              Nous nous réservons le droit, à notre seule discrétion, de
              modifier ces Conditions à tout moment. Toute modification entrera
              en vigueur immédiatement après sa publication sur le Site. Votre
              utilisation continue du Site après la publication des
              modifications constitue votre acceptation des Conditions
              modifiées.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">2. Services</h2>

            <p className="text-muted-foreground mb-4">
              M3mly est une plateforme qui connecte les marques de vêtements
              avec des fabricants marocains. Nous facilitons le processus de
              production en offrant un accès à un réseau d'usines vérifiées, des
              outils de gestion de commandes, et des services de contrôle
              qualité.
            </p>

            <p className="text-muted-foreground mb-4">
              Nos services comprennent, sans s'y limiter:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>L'accès à un catalogue d'usines de confection marocaines</li>
              <li>La facilitation des demandes d'échantillons</li>
              <li>La gestion des commandes de production</li>
              <li>Le suivi des commandes et des expéditions</li>
              <li>Les services de contrôle qualité</li>
              <li>La gestion des paiements sécurisés</li>
            </ul>

            <p className="text-muted-foreground">
              Nous nous réservons le droit de modifier, suspendre ou interrompre
              tout aspect de nos services à tout moment, y compris la
              disponibilité de toute fonctionnalité, base de données ou contenu.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              3. Inscription et Comptes
            </h2>

            <p className="text-muted-foreground mb-4">
              Pour accéder à certaines fonctionnalités de notre Site, vous
              devrez créer un compte. Vous acceptez de fournir des informations
              exactes, actuelles et complètes lors de l'inscription et de
              maintenir ces informations à jour.
            </p>

            <p className="text-muted-foreground mb-4">
              Vous êtes responsable de la confidentialité de votre mot de passe
              et de toutes les activités qui se produisent sous votre compte.
              Vous acceptez de nous informer immédiatement de toute utilisation
              non autorisée de votre compte ou de toute autre violation de la
              sécurité.
            </p>

            <p className="text-muted-foreground">
              Nous nous réservons le droit de refuser l'accès, de fermer des
              comptes, de supprimer ou de modifier du contenu, ou d'annuler des
              commandes à notre seule discrétion.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              4. Commandes et Paiements
            </h2>

            <p className="text-muted-foreground mb-4">
              En passant une commande via notre plateforme, vous acceptez de
              payer tous les frais associés à cette commande, y compris le prix
              des produits, les frais d'expédition, les taxes et autres frais
              applicables.
            </p>

            <p className="text-muted-foreground mb-4">
              Les paiements sont traités selon les modalités spécifiées lors du
              processus de commande. Pour certaines commandes, un acompte peut
              être requis avant le début de la production, avec le solde dû
              avant l'expédition.
            </p>

            <p className="text-muted-foreground mb-4">
              Toutes les commandes sont soumises à acceptation et disponibilité.
              Nous nous réservons le droit de refuser ou d'annuler toute
              commande pour quelque raison que ce soit, y compris des erreurs
              dans la description ou le prix des produits, ou des problèmes
              identifiés par notre équipe de crédit et de fraude.
            </p>

            <p className="text-muted-foreground">
              Les délais de production et de livraison sont fournis à titre
              indicatif et peuvent varier en fonction de divers facteurs, y
              compris la complexité de la commande, la disponibilité des
              matériaux et les conditions logistiques.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              5. Propriété Intellectuelle
            </h2>

            <p className="text-muted-foreground mb-4">
              Tout le contenu présent sur notre Site, y compris, mais sans s'y
              limiter, les textes, graphiques, logos, icônes, images, clips
              audio, téléchargements numériques et compilations de données, est
              la propriété de M3mly ou de ses fournisseurs de contenu et est
              protégé par les lois marocaines et internationales sur la
              propriété intellectuelle.
            </p>

            <p className="text-muted-foreground mb-4">
              Vous ne pouvez pas reproduire, distribuer, afficher, vendre,
              louer, transmettre, créer des œuvres dérivées, traduire, modifier,
              faire de l'ingénierie inverse, désassembler, décompiler ou
              exploiter de quelque manière que ce soit tout contenu ou partie de
              notre Site sans notre autorisation écrite préalable.
            </p>

            <p className="text-muted-foreground">
              En soumettant des designs, spécifications ou autres matériaux à
              notre plateforme, vous garantissez que vous possédez tous les
              droits nécessaires sur ces matériaux et vous nous accordez une
              licence non exclusive, mondiale, libre de redevances pour utiliser
              ces matériaux dans le cadre de la fourniture de nos services.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              6. Limitation de Responsabilité
            </h2>

            <p className="text-muted-foreground mb-4">
              Dans toute la mesure permise par la loi applicable, M3mly, ses
              dirigeants, administrateurs, employés, agents et fournisseurs ne
              seront pas responsables des dommages indirects, spéciaux,
              accessoires, consécutifs ou punitifs, y compris, mais sans s'y
              limiter, la perte de profits, de données, d'utilisation, de
              clientèle ou d'autres pertes intangibles, résultant de:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>
                Votre utilisation ou incapacité à utiliser notre Site ou nos
                services
              </li>
              <li>Tout contenu ou conduite de tiers sur notre Site</li>
              <li>
                Toute transaction ou relation entre vous et un fabricant ou un
                autre tiers
              </li>
              <li>
                Tout accès non autorisé, utilisation ou altération de vos
                transmissions ou contenus
              </li>
            </ul>

            <p className="text-muted-foreground">
              Notre responsabilité totale envers vous pour toute réclamation
              découlant de ou liée à ces Conditions ou à notre Site ne dépassera
              pas le montant que vous avez payé pour les services au cours des
              six (6) mois précédant la réclamation.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">7. Indemnisation</h2>

            <p className="text-muted-foreground">
              Vous acceptez d'indemniser, de défendre et de dégager de toute
              responsabilité M3mly, ses dirigeants, administrateurs, employés,
              agents et fournisseurs contre toute réclamation, responsabilité,
              dommage, perte et dépense, y compris, sans limitation, les frais
              juridiques et comptables raisonnables, découlant de ou liés à
              votre violation de ces Conditions, votre utilisation de notre Site
              ou de nos services, ou votre violation de tout droit d'un tiers.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              8. Loi Applicable et Juridiction
            </h2>

            <p className="text-muted-foreground">
              Ces Conditions sont régies par les lois du Maroc, sans égard aux
              principes de conflits de lois. Tout litige découlant de ou lié à
              ces Conditions ou à votre utilisation de notre Site ou de nos
              services sera soumis à la juridiction exclusive des tribunaux
              compétents de Casablanca, Maroc.
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
            <h2 className="text-2xl font-bold mb-6">9. Contact</h2>

            <p className="text-muted-foreground mb-6">
              Si vous avez des questions concernant ces Conditions, veuillez
              nous contacter à:
            </p>

            <div className="bg-secondary/30 p-6 rounded-lg border border-border/50">
              <p className="mb-2">
                <strong>M3mly</strong>
              </p>
              <p className="mb-2">123 Boulevard Mohammed V</p>
              <p className="mb-2">Casablanca, 20250</p>
              <p className="mb-2">Maroc</p>
              <p className="mb-2">Email: legal@m3mly.com</p>
              <p>Téléphone: +212 522 123 456</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/privacy">
              <Button
                variant="outline"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Voir notre Politique de Confidentialité
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
