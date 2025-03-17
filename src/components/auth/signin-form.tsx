"use client";

import { useState, useEffect } from "react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { Mail, Lock } from "lucide-react";

export default function SignInForm({ message }: { message?: Message }) {
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
      <form className="flex flex-col space-y-6" action={signInAction}>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isRtl ? "تسجيل الدخول" : "Se connecter"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? "ليس لديك حساب؟" : "Vous n'avez pas de compte ?"}{" "}
            <Link
              className="text-primary font-medium hover:underline transition-all"
              href="/sign-up"
            >
              {isRtl ? "تسجيل" : "S'inscrire"}
            </Link>
          </p>
        </div>

        <div className="space-y-4">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {isRtl ? "كلمة المرور" : "Mot de passe"}
              </Label>
              <Link
                className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                href="/forgot-password"
              >
                {isRtl ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?"}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder={isRtl ? "كلمة المرور الخاصة بك" : "Votre mot de passe"}
              required
              className={cn(
                "w-full",
                isRtl && "text-right"
              )}
            />
          </div>
        </div>

        <SubmitButton
          pendingText={isRtl ? "جاري تسجيل الدخول..." : "Connexion en cours..."}
          className="w-full"
        >
          {isRtl ? "تسجيل الدخول" : "Se connecter"}
        </SubmitButton>

        {message && <FormMessage message={message} />}
      </form>
    </div>
  );
} 