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
} from "lucide-react";
import { signOutAction } from "@/app/actions";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainRoutes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "My Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/orders",
      active: pathname === "/dashboard/orders",
    },
    {
      label: "Sample Requests",
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/samples",
      active: pathname === "/dashboard/samples",
    },
    {
      label: "Invoices",
      icon: <FileText className="h-5 w-5" />,
      href: "/dashboard/invoices",
      active: pathname === "/dashboard/invoices",
    },
    {
      label: "Shipments",
      icon: <Truck className="h-5 w-5" />,
      href: "/dashboard/shipments",
      active: pathname === "/dashboard/shipments",
    },
  ];

  const exploreRoutes = [
    {
      label: "Browse Factories",
      icon: <Building className="h-5 w-5" />,
      href: "/factories",
      active: pathname === "/factories",
    },
    {
      label: "Discover Products",
      icon: <Store className="h-5 w-5" />,
      href: "/products",
      active: pathname === "/products",
    },
    {
      label: "Search",
      icon: <Search className="h-5 w-5" />,
      href: "/search",
      active: pathname === "/search",
    },
  ];

  const settingsRoutes = [
    {
      label: "Payment Methods",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/payment-methods",
      active: pathname === "/dashboard/payment-methods",
    },
    {
      label: "Profile Settings",
      icon: <User className="h-5 w-5" />,
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
    },
    {
      label: "Account Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  if (!mounted) return null;

  return (
    <div className="h-screen sticky top-0 w-72 border-r bg-gradient-to-b from-background to-background/80 backdrop-blur-sm flex flex-col shadow-md">
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src="/logo.svg" alt="M3mly Logo" className="h-full w-full" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#171E44" }}>
            M3mly
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">Your manufacturing hub</p>
      </div>

      <div className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-thin">
        <div>
          <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-4 mb-2">
            Main
          </h3>
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-200",
                    route.active
                      ? "bg-secondary/80 shadow-sm"
                      : "hover:bg-secondary/50",
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
          <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-4 mb-2">
            Explore
          </h3>
          <div className="space-y-1">
            {exploreRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-200",
                    route.active
                      ? "bg-secondary/80 shadow-sm"
                      : "hover:bg-secondary/50",
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
          <h3 className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-4 mb-2">
            Settings
          </h3>
          <div className="space-y-1">
            {settingsRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 font-medium transition-all duration-200",
                    route.active
                      ? "bg-secondary/80 shadow-sm"
                      : "hover:bg-secondary/50",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/20">
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50/30 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
