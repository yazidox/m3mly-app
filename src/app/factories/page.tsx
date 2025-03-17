import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import FactoriesContent from "@/components/factories-content";
import ClientLanguageProvider from "@/components/client-language-provider";

export default async function FactoriesPage() {
  // Fetch factories from database
  const supabase = await createClient();
  const { data: factories, error } = await supabase
    .from("factories")
    .select("*")
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Error fetching factories:", error);
  }

  // Use empty array if no factories found
  const factoryList = factories || [];

  // Catégories pour le filtre
  const categories = [
    "T-shirts",
    "Robes",
    "Vêtements de sport",
    "Denim",
    "Vêtements d'extérieur",
    "Tricots",
    "Tenues formelles",
    "Vêtements traditionnels",
    "Accessoires",
    "Vêtements décontractés",
    "Sportswear",
    "Uniformes",
    "Vêtements durables",
    "Vêtements de plage",
    "Vêtements de villégiature",
    "Maillots de bain",
  ];

  // Emplacements pour le filtre
  const locations = [
    "Casablanca",
    "Marrakech",
    "Fès",
    "Tanger",
    "Rabat",
    "Agadir",
  ];

  return (
    <div className="min-h-screen bg-background">
      <ClientLanguageProvider />
      <Navbar />
      
      <FactoriesContent 
        factoryList={factoryList}
        categories={categories}
        locations={locations}
      />

      <Footer />
    </div>
  );
}
