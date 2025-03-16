export const dynamic = "force-dynamic";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Factory,
  Truck,
  Scissors,
  Search,
  Filter,
  Star,
  Sparkles,
  ArrowRight,
  Award,
  ShieldCheck,
  Users,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ClientLanguageProviderHome from "@/components/client-language-provider-home";
import {
  HeroSection,
  FactoryListingsSection,
  HowItWorksSection,
  StatsSection,
  CTASection,
} from "@/components/home-sections";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch featured factories from database
  const { data: featuredFactories, error: factoriesError } = await supabase
    .from("factories")
    .select("*")
    .eq("status", "approved")
    .order("rating", { ascending: false })
    .limit(3);

  if (factoriesError) {
    console.error("Error fetching featured factories:", factoriesError);
  }

  // Use empty array if no factories found
  const featuredFactoryList = featuredFactories || [];

  return (
    <ClientLanguageProviderHome>
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Factory Listings Section */}
      <FactoryListingsSection featuredFactoryList={featuredFactoryList} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </ClientLanguageProviderHome>
  );
}
