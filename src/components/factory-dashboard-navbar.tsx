"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Factory,
  FileText,
  Home,
  Package,
  Settings,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface FactoryDashboardNavbarProps {
  factory: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export default function FactoryDashboardNavbar({
  factory,
}: FactoryDashboardNavbarProps) {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-border bg-card py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/factory-dashboard" className="flex items-center gap-3">
            {factory.image ? (
              <div className="relative h-8 w-8 rounded-md overflow-hidden">
                <Image
                  src={factory.image}
                  alt={factory.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <Factory className="h-6 w-6 text-primary" />
            )}
            <span className="font-bold text-lg hidden sm:inline">
              {factory.name}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Factory Dashboard
            </span>
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-4">
            <Link href="/factory-dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/factory-dashboard?tab=orders">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                <span>Orders</span>
              </Button>
            </Link>
            <Link href="/factory-dashboard/invoices">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Invoices</span>
              </Button>
            </Link>
            <Link href="/factory-dashboard/settings">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/factory/${factory.id}`)}
              >
                View Public Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/factory-dashboard/settings")}
              >
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                  router.push("/sign-in");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
