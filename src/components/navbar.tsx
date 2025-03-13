import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Factory, Search, UserCircle, Menu, Sparkles, ChevronDown } from "lucide-react";
import UserProfile from "./user-profile";
import { t } from "@/lib/i18n/server";
import LanguageSwitcher from "./language-switcher";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md py-3 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-2 group">
          <div className="w-[130px] relative overflow-hidden transition-all duration-300 group-hover:scale-105">
            <img src="/logo.svg" alt="M3mly Logo" className="h-full w-full" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
          </div>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/factories"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <Factory className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              {t("common.browse_factories")}
            </span>
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/#how-it-works"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              {t("common.how_it_works")}
            </span>
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/#pricing"
            className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
          >
            <span className="flex items-center gap-1.5">
              <ChevronDown className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors" />
              {t("common.pricing")}
            </span>
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button 
                  variant="secondary" 
                  className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-border/50 hover:border-primary/30 backdrop-blur-sm font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCircle className="h-4 w-4 text-primary" />
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
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative group"
              >
                <span>{t("common.sign_in")}</span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/sign-up">
                <Button 
                  className={cn(
                    "group relative overflow-hidden shadow-md hover:shadow-glow hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 font-medium",
                    "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  )}
                >
                  <span className="relative z-10 flex items-center">
                    {t("common.sign_up")}
                    <Sparkles className="ml-2 w-4 h-4 opacity-80 group-hover:opacity-100 animate-pulse" />
                  </span>
                </Button>
              </Link>
            </>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-secondary/80 transition-colors shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
