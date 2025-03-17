import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Shield,
  Trash2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Users,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/settings");
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  return (
    <div className="space-y-8 relative overflow-hidden">
      <div className="relative">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight leading-tight">
          Paramètres du{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
            Compte
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Gérez vos préférences et paramètres pour une expérience personnalisée
          sur M3mly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Notification Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border transform transition-all duration-500  hover:shadow-xl hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow">
                <Bell className="h-5 w-5" />
              </div>
              <span>Notifications</span>
            </CardTitle>
            <CardDescription className="text-base">
              Contrôlez comment vous recevez les notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Notifications par Email
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_orders" className="font-medium">
                      Mises à jour des commandes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des emails sur les changements de statut de vos commandes
                    </p>
                  </div>
                  <Switch id="email_orders" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_samples" className="font-medium">
                      Demandes d'échantillons
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des emails sur les mises à jour de vos demandes d'échantillons
                    </p>
                  </div>
                  <Switch id="email_samples" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_invoices" className="font-medium">
                      Factures & Paiements
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des emails concernant les factures et confirmations de paiement
                    </p>
                  </div>
                  <Switch id="email_invoices" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_marketing" className="font-medium">
                      Marketing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des emails promotionnels et offres spéciales
                    </p>
                  </div>
                  <Switch id="email_marketing" />
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                Notifications par SMS
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_orders" className="font-medium">
                      Mises à jour des commandes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des SMS sur les changements de statut de vos commandes
                    </p>
                  </div>
                  <Switch id="sms_orders" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_delivery" className="font-medium">
                      Mises à jour des livraisons
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des SMS sur le statut de vos livraisons
                    </p>
                  </div>
                  <Switch id="sms_delivery" />
                </div>
              </div>

              <Button className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden w-full justify-center mt-6">
                <span className="relative z-10 flex items-center">
                  Enregistrer les préférences
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language & Appearance */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border transform transition-all duration-500  hover:shadow-xl hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow">
                <Globe className="h-5 w-5" />
              </div>
              <span>Langue & Apparence</span>
            </CardTitle>
            <CardDescription className="text-base">
              Personnalisez votre langue et vos préférences d'affichage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Langue</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border transform transition-all duration-300",
                      "hover:scale-105 hover:shadow-md hover:border-primary/20"
                    )}
                  >
                    <span className="mr-2 text-lg">🇫🇷</span> Français
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border transform transition-all duration-300",
                      "hover:scale-105 hover:shadow-md hover:border-primary/20"
                    )}
                  >
                    <span className="mr-2 text-lg">🇲🇦</span> العربية
                  </Button>
                </div>
              </div>

              <Separator />

              <Button className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden w-full justify-center mt-6">
                <span className="relative z-10 flex items-center">
                  Enregistrer les préférences
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border transform transition-all duration-500  hover:shadow-xl hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span>Confidentialité</span>
            </CardTitle>
            <CardDescription className="text-base">
              Contrôlez vos données et préférences de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all hover:scale-[1.02]">
                <div className="space-y-1">
                  <Label htmlFor="data_collection" className="font-medium">
                    Collecte de données
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nous permettre de collecter des données d'utilisation pour
                    améliorer nos services
                  </p>
                </div>
                <Switch id="data_collection" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all hover:scale-[1.02]">
                <div className="space-y-1">
                  <Label htmlFor="personalized_ads" className="font-medium">
                    Recommandations personnalisées
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des recommandations de produits personnalisées
                  </p>
                </div>
                <Switch id="personalized_ads" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-card/70 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/20 hover:bg-card/80 transition-all hover:scale-[1.02]">
                <div className="space-y-1">
                  <Label htmlFor="third_party_sharing" className="font-medium">
                    Partage avec des tiers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser le partage de vos données avec des tiers de
                    confiance
                  </p>
                </div>
                <Switch id="third_party_sharing" />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-6">
                <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Données cryptées</span>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Conforme au RGPD</span>
                </div>
                <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Contrôle total</span>
                </div>
              </div>

              <Button className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden w-full justify-center mt-6">
                <span className="relative z-10 flex items-center">
                  Enregistrer les paramètres de confidentialité
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </CardContent>
        </Card>

    
      </div>
    </div>
  );
}
