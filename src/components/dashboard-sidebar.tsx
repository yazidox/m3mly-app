"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Truck,
  Settings,
  CreditCard,
  User,
  LogOut,
  Building,
  Search,
  Store,
  Sparkles,
  Star,
  ShieldCheck,
} from "lucide-react";
import { signOutAction } from "@/app/actions";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/client";
import DashboardLanguageSwitcher from "./dashboard-language-switcher";
import Image from "next/image";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainRoutes = [
    {
      label: t("common.dashboard"),
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: t("dashboard.orders"),
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/orders",
      active: pathname === "/dashboard/orders",
    },
    {
      label: t("dashboard.samples"),
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/samples",
      active: pathname === "/dashboard/samples",
    },
    {
      label: t("dashboard.invoices"),
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/invoices",
      active: pathname === "/dashboard/invoices",
    },
    {
      label: t("dashboard.shipments"),
      icon: <Truck className="h-5 w-5" />,
      href: "/dashboard/shipments",
      active: pathname === "/dashboard/shipments",
    },
  ];

  const exploreRoutes = [
    {
      label: t("common.browse_factories"),
      icon: <Building className="h-5 w-5" />,
      href: "/products",
      active: pathname === "/factories",
    },
    {
      label: t("common.find_factories"),
      icon: <Store className="h-5 w-5" />,
      href: "/factories",
      active: pathname === "/products",
    },
  ];

  const settingsRoutes = [
    {
      label: t("dashboard.payment_methods"),
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/payment-methods",
      active: pathname === "/dashboard/payment-methods",
    },
    {
      label: t("dashboard.profile"),
      icon: <User className="h-5 w-5" />,
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
    },
    {
      label: t("dashboard.settings"),
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  if (!mounted) return null;

  // Set RTL direction for Arabic language
  const { locale } = useLanguage();
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <div
      className="h-screen sticky top-0 w-72 border-r bg-gradient-to-b from-background via-background to-secondary/10 backdrop-blur-sm flex flex-col shadow-md relative overflow-hidden"
      dir={dir}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-5" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -left-20 w-60 h-60 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-60 -right-20 w-40 h-40 bg-accent/15 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="p-6 border-b border-border/40 relative z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[160px] flex items-center justify-center">
            <img src={isRtl ? "/logo-ar.png" : "/logo.svg"} alt="M3mly Logo" className="h-full w-full" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full  text-primary text-xs font-medium backdrop-blur-sm  shadow-glow">
            <span className="relative">{isRtl ? "لغة" : "Langue"}</span>
          </div>
          <DashboardLanguageSwitcher />
        </div>
      </div>

      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-thin relative z-10">
        <div>
          <h3 className="text-xs uppercase text-primary font-semibold tracking-wider px-4 mb-3 flex items-center">
            <span className="bg-primary/20 p-1 rounded-md mr-2">
              <LayoutDashboard className="h-3 w-3 text-primary" />
            </span>
            {isRtl ? "الرئيسية" : "Principal"}
          </h3>
          <div className="space-y-1.5">
            {mainRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-300",
                    route.active
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary shadow-sm border border-primary/10"
                      : "hover:bg-secondary/50 hover:translate-x-1"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase text-accent font-semibold tracking-wider px-4 mb-3 flex items-center">
            <span className="bg-accent/20 p-1 rounded-md mr-2">
              <Search className="h-3 w-3 text-accent" />
            </span>
            {isRtl ? "استكشاف" : "Explorer"}
          </h3>
          <div className="space-y-1.5">
            {exploreRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-300",
                    route.active
                      ? "bg-gradient-to-r from-accent/20 to-primary/20 text-accent shadow-sm border border-accent/10"
                      : "hover:bg-secondary/50 hover:translate-x-1"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-4 mb-3 flex items-center">
            <span className="bg-secondary/30 p-1 rounded-md mr-2">
              <Settings className="h-3 w-3 text-black" />
            </span>
            {isRtl ? "الإعدادات" : "Paramètres"}
          </h3>
          <div className="space-y-1.5">
            {settingsRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-300",
                    route.active
                      ? "bg-gradient-to-r from-secondary/30 to-secondary/10 shadow-sm border border-secondary/20"
                      : "hover:bg-secondary/50 hover:translate-x-1"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 mt-6">
          <div className="relative bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            <div className="flex items-start gap-3 relative">
              <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">
                  {isRtl ? "مركز المساعدة" : "Centre d'aide"}
                </h4>
                <p className="text-muted-foreground text-xs mb-2">
                  {isRtl
                    ? "هل تحتاج إلى مساعدة؟"
                    : "Besoin d'aide avec votre compte?"}
                </p>
                <Link
                  href="/support"
                  className="text-xs text-primary flex items-center hover:underline"
                >
                  {isRtl ? "تواصل معنا" : "Contactez-nous"}
                  <Star className="ml-1 w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/20 backdrop-blur-sm relative z-10">
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-white hover:bg-red-500/80 transition-all duration-300 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <LogOut className="h-5 w-5" />
              {t("dashboard.logout")}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </form>
      </div>
    </div>
  );
}
