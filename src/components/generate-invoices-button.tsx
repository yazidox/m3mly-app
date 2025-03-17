"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";

export default function GenerateInvoicesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerateInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dashboard/generate-invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invoices");
      }

      toast({
        title: "Success",
        description: "Invoices generated successfully",
        variant: "default",
      });

      // Refresh the page to show the new invoices
      router.refresh();
    } catch (error) {
      console.error("Error generating invoices:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate invoices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateInvoices}
      disabled={isLoading}
      className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération en cours...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          <span className="relative z-10">Générer les factures manquantes</span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
    </Button>
  );
}
