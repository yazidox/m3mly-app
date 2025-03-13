import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  FileText,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/profile");
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

  async function updateProfile(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    const fullName = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const cin = formData.get("cin") as string;

    // Update user profile
    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        phone,
        address,
        cin,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return redirect("/dashboard/profile?error=update_failed");
    }

    return redirect("/dashboard/profile?message=profile_updated");
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative space-y-8  w-full mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Bienvenue sur votre{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
              profil
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Gérez vos informations personnelles et préférences pour une
            expérience optimale sur notre plateforme
          </p>
        </div>

        {/* Profile information */}
        <Card className="border border-border/50 shadow-xl backdrop-blur-sm bg-card/80 overflow-hidden transform transition-all duration-300 hover:shadow-glow hover:shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCircle className="h-6 w-6 text-primary" />
              <span>Informations Personnelles</span>
            </CardTitle>
            <CardDescription className="text-base">
              Mettez à jour vos coordonnées et informations de contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-4 bg-secondary/20 rounded-xl border border-border/50">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-24 w-24 rounded-full flex items-center justify-center shadow-glow">
                  <UserCircle className="h-14 w-14 text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-medium text-lg mb-1">Photo de Profil</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Téléchargez une photo pour personnaliser votre profil
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="group relative overflow-hidden border-primary/50"
                  >
                    <span className="relative z-10 flex items-center">
                      Télécharger une image
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-base">
                    Nom Complet
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={userData?.full_name || ""}
                    required
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={userData?.email || ""}
                    disabled
                    className="border-border/50 bg-muted/30 backdrop-blur-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Pour changer votre email, veuillez contacter le support
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Numéro de Téléphone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={userData?.phone || ""}
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cin" className="text-base">
                    CIN (Carte d'Identité Nationale)
                  </Label>
                  <Input
                    id="cin"
                    name="cin"
                    defaultValue={userData?.cin || ""}
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base">
                  Adresse de Livraison
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  rows={3}
                  defaultValue={userData?.address || ""}
                  className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <Button type="submit" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Enregistrer les modifications
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account security */}
        <Card className="border border-border/50 shadow-xl backdrop-blur-sm bg-card/80 overflow-hidden transform transition-all duration-300 hover:shadow-glow hover:shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              <span>Sécurité du Compte</span>
            </CardTitle>
            <CardDescription className="text-base">
              Gérez votre mot de passe et la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4 p-4 bg-secondary/20 rounded-xl border border-border/50">
                <div className="space-y-2">
                  <Label htmlFor="current_password" className="text-base">
                    Mot de Passe Actuel
                  </Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-base">
                    Nouveau Mot de Passe
                  </Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-base">
                    Confirmer le Nouveau Mot de Passe
                  </Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    className="border-border/50 bg-card/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Mettre à jour le mot de passe
                  <Lock className="ml-2 w-4 h-4" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </form>

            <Separator className="my-8" />

            <div className="space-y-4">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Activité du Compte
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-xl border border-border/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email Vérifié</p>
                      <p className="text-sm text-muted-foreground">
                        Votre adresse email a été vérifiée avec succès
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 px-3"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Vérifié
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-xl border border-border/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dernière Connexion</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center mt-8">
          <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Données sécurisées</span>
          </div>
          <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Confidentialité garantie</span>
          </div>
          <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Support 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
