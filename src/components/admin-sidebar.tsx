"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Factory,
  Package,
  Users,
  Settings,
  LogOut,
  FileText,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Factories",
    href: "/admin/factories",
    icon: <Factory className="h-5 w-5" />,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border bg-card h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold">M3mly Admin</span>
        </Link>
      </div>

      <div className="px-3 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-border">
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            type="submit"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
