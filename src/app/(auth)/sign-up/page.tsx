import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                S'inscrire
              </h1>
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Nom complet
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Jean Dupont"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Numéro de téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6XX XXXXXX"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Adresse
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Votre adresse complète"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cin" className="text-sm font-medium">
                  Numéro CIN
                </Label>
                <Input
                  id="cin"
                  name="cin"
                  type="text"
                  placeholder="Votre numéro de carte d'identité nationale"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="referral_source"
                  className="text-sm font-medium"
                >
                  Comment avez-vous entendu parler de M3mly ?
                </Label>
                <Select name="referral_source">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">
                      Réseaux sociaux
                    </SelectItem>
                    <SelectItem value="friend">Ami ou collègue</SelectItem>
                    <SelectItem value="search">Moteur de recherche</SelectItem>
                    <SelectItem value="event">Événement ou salon</SelectItem>
                    <SelectItem value="advertisement">Publicité</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Votre mot de passe"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <SubmitButton
              formAction={signUpAction}
              pendingText="Inscription en cours..."
              className="w-full"
            >
              S'inscrire
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
