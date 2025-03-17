"use client";

import { useState, useEffect } from "react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, MapPin, CreditCard, Info, Lock } from "lucide-react";

export default function SignupForm({ message }: { message?: Message }) {
  const [mounted, setMounted] = useState(false);
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      <form className="flex flex-col space-y-6" action={signUpAction}>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isRtl ? "تسجيل" : "S'inscrire"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? "هل لديك حساب بالفعل؟" : "Vous avez déjà un compte ?"}{" "}
            <Link
              className="text-primary font-medium hover:underline transition-all"
              href="/sign-in"
            >
              {isRtl ? "تسجيل الدخول" : "Se connecter"}
            </Link>
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              {isRtl ? "الاسم الكامل" : "Nom complet"}
            </Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder={isRtl ? "محمد العربي" : "Jean Dupont"}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {isRtl ? "البريد الإلكتروني" : "Email"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={isRtl ? "أنت@مثال.com" : "vous@exemple.com"}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {isRtl ? "رقم الهاتف" : "Numéro de téléphone"}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+212 6XX XXXXXX"
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {isRtl ? "العنوان" : "Adresse"}
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder={isRtl ? "عنوانك الكامل" : "Votre adresse complète"}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cin" className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {isRtl ? "رقم البطاقة الوطنية" : "Numéro CIN"}
            </Label>
            <Input
              id="cin"
              name="cin"
              type="text"
              placeholder={isRtl ? "رقم بطاقة التعريف الوطنية الخاصة بك" : "Votre numéro de carte d'identité nationale"}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="referral_source"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              {isRtl ? "كيف سمعت عن M3mly؟" : "Comment avez-vous entendu parler de M3mly ?"}
            </Label>
            <Select name="referral_source">
              <SelectTrigger className={cn(
                "w-full",
                isRtl && "text-right"
              )}>
                <SelectValue placeholder={isRtl ? "حدد خيارًا" : "Sélectionnez une option"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="social_media">
                  {isRtl ? "وسائل التواصل الاجتماعي" : "Réseaux sociaux"}
                </SelectItem>
                <SelectItem value="friend">
                  {isRtl ? "صديق أو زميل" : "Ami ou collègue"}
                </SelectItem>
                <SelectItem value="search">
                  {isRtl ? "محرك بحث" : "Moteur de recherche"}
                </SelectItem>
                <SelectItem value="event">
                  {isRtl ? "حدث أو معرض" : "Événement ou salon"}
                </SelectItem>
                <SelectItem value="advertisement">
                  {isRtl ? "إعلان" : "Publicité"}
                </SelectItem>
                <SelectItem value="other">
                  {isRtl ? "آخر" : "Autre"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {isRtl ? "كلمة المرور" : "Mot de passe"}
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder={isRtl ? "كلمة المرور الخاصة بك" : "Votre mot de passe"}
              minLength={6}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>
        </div>

        <SubmitButton
          pendingText={isRtl ? "جاري التسجيل..." : "Inscription en cours..."}
          className="w-full"
        >
          {isRtl ? "تسجيل" : "S'inscrire"}
        </SubmitButton>

        {message && <FormMessage message={message} />}
      </form>
    </div>
  );
} 