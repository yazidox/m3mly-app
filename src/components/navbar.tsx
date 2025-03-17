"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Factory,
  Search,
  UserCircle,
  Menu,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";
import UserProfile from "./user-profile";
import { useLanguage } from "@/lib/i18n/client";
import LanguageSwitcher from "./language-switcher";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle component mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user data
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    getUser();
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    
    router.refresh();
  }, [locale, isRtl, router]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="w-[130px]"></div>
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    );
  }

  if (loading) {
    return (
      <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="w-[130px]"></div>
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      key={locale}
      className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md py-3 sticky top-0 z-50 shadow-md"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className={`flex items-center gap-2 group ${isRtl ? "order-first" : "order-first"}`}
        >
          <div className="w-[130px] relative overflow-hidden transition-all duration-300 group-hover:scale-105">
            <img src={isRtl ? "/logo-ar.png" : "/logo.svg"} alt="M3mly Logo" className="h-full w-full" />
            <div
              className={`absolute -inset-1 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary/10 to-accent/10 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300`}
            />
          </div>
        </Link>

        <div
          className={`hidden md:flex gap-8 items-center ${isRtl ? "mr-auto ml-4" : "ml-auto mr-4"}`}
        >
          <Link
            href="/factories"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <Factory
                className={`h-4 w-4 text-primary/70 group-hover:text-primary transition-colors ${isRtl ? "ml-1.5" : "mr-1.5"}`}
              />
              {t("common.browse_factories")}
            </span>
            <span
              className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
          <Link
            href="/#how-it-works"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles
                className={`h-4 w-4 text-primary/70 group-hover:text-primary transition-colors ${isRtl ? "ml-1.5" : "mr-1.5"}`}
              />
              {t("common.how_it_works")}
            </span>
            <span
              className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
          <Link
            href="/#pricing"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <ChevronDown
                className={`h-4 w-4 text-primary/70 group-hover:text-primary transition-colors ${isRtl ? "ml-1.5" : "mr-1.5"}`}
              />
              {t("common.pricing")}
            </span>
            <span
              className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
        </div>

        <div
          className={`flex gap-4 items-center ${isRtl ? "order-last" : "order-last"}`}
        >
          <LanguageSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-border/50 hover:border-primary/30 backdrop-blur-sm font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCircle
                      className={`h-4 w-4 text-primary ${isRtl ? "ml-1.5" : "mr-1.5"}`}
                    />
                    {t("common.dashboard")}
                  </span>
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group hidden sm:block"
              >
                <span>{t("common.sign_in")}</span>
                <span
                  className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                ></span>
              </Link>
              <Link href="/sign-up" className="hidden sm:block">
                <Button
                  className={cn(
                    "group relative overflow-hidden shadow-md hover:shadow-glow hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 font-medium",
                    `${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent hover:from-primary/90 hover:to-accent/90`,
                  )}
                >
                  <span className="relative z-10 flex items-center">
                  <Sparkles
                      className={`${isRtl ? "mr-2" : "mr-2"} w-4 h-4 opacity-80 group-hover:opacity-100 animate-pulse`}
                    />
                    {t("common.sign_up")}
                  
                  </span>
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-secondary/80 transition-colors shadow-sm"
                aria-label={t("common.menu")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "right" : "left"} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full" dir={isRtl ? "rtl" : "ltr"}>
                <div className="flex justify-between items-center mb-6">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-[100px] relative">
                      <img src="/logo.svg" alt="M3mly Logo" className="h-full w-full" />
                    </div>
                  </Link>
                </div>
                
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/factories"
                    className="text-foreground/80 hover:text-foreground font-medium transition-colors p-2 rounded-md hover:bg-secondary/50"
                  >
                    <span className="flex items-center gap-2">
                      <Factory className="h-5 w-5 text-primary/70" />
                      {t("common.browse_factories")}
                    </span>
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-foreground/80 hover:text-foreground font-medium transition-colors p-2 rounded-md hover:bg-secondary/50"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary/70" />
                      {t("common.how_it_works")}
                    </span>
                  </Link>
                  <Link
                    href="/#pricing"
                    className="text-foreground/80 hover:text-foreground font-medium transition-colors p-2 rounded-md hover:bg-secondary/50"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronDown className="h-5 w-5 text-primary/70" />
                      {t("common.pricing")}
                    </span>
                  </Link>
                  
                  {!user && (
                    <div className="flex flex-col gap-3 mt-4">
                      <Link href="/sign-in">
                        <Button variant="outline" className="w-full justify-start">
                          {t("common.sign_in")}
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button 
                          className={cn(
                            "w-full justify-start",
                            `${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent hover:from-primary/90 hover:to-accent/90`
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {t("common.sign_up")}
                            <Sparkles className="h-4 w-4 opacity-80" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {user && (
                    <div className="flex flex-col gap-3 mt-4">
                      <Link href="/dashboard">
                        <Button variant="secondary" className="w-full justify-start">
                          <span className="flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-primary" />
                            {t("common.dashboard")}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
                
                <div className="mt-auto pt-6 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("common.language")}:
                    </span>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
