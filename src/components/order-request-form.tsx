"use client";

import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CheckCircle, Loader2, Upload, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import FileUploadButton from './file-upload-button';
import { cn } from "@/lib/utils";

interface OrderRequestFormProps {
  product: any;
  userData: any;
  placeOrder: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function OrderRequestForm({ product, userData, placeOrder }: OrderRequestFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    try {
      const result = await placeOrder(formData);
      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
        <div className="p-5 bg-primary/15 text-primary rounded-full border border-primary/20 shadow-glow">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Commande Passée avec Succès!</h2>
        <p className="text-muted-foreground max-w-md text-lg">
          Merci d'avoir passé votre commande pour {product.name}. Notre équipe examinera les détails de votre commande et vous contactera prochainement concernant les prochaines étapes.
        </p>
        <div className="mt-8 space-y-4 w-full max-w-md">
          <Link
            href="/dashboard/orders"
            className="group relative inline-flex items-center justify-center w-full px-8 py-4 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Voir Mes Commandes
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href={`/factory/${product.factory_id}/products`}
            className="group relative inline-flex items-center justify-center w-full px-8 py-4 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-lg font-medium border border-border overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Parcourir Plus de Produits
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 relative">
      <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
        <Sparkles className="w-4 h-4 mr-2" />
        <span className="relative">FORMULAIRE DE COMMANDE</span>
      </div>
      
      <input type="hidden" name="product_id" value={product.id} />
      <input type="hidden" name="factory_id" value={product.factory_id} />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom Complet</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={userData?.full_name || ""}
              required
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={userData?.email || ""}
              required
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={userData?.phone || ""}
              required
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Nom de l'Entreprise</Label>
            <Input 
              id="company" 
              name="company" 
              required 
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shipping_address">Adresse de Livraison</Label>
          <Textarea
            id="shipping_address"
            name="shipping_address"
            rows={3}
            defaultValue={userData?.address || ""}
            required
            className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité Commandée</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={product.min_order_quantity}
              defaultValue={product.min_order_quantity}
              required
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Input 
              id="color" 
              name="color" 
              required 
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="size">Taille</Label>
            <Input 
              id="size" 
              name="size" 
              required 
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Matériel</Label>
            <Input 
              id="material" 
              name="material" 
              required 
              className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="design_files">Fichiers de Design</Label>
          <div className="border border-dashed border-primary/30 rounded-xl p-8 text-center bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all group">
            <Upload className="mx-auto h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-muted-foreground mb-3">
              Glissez et déposez vos fichiers de design ici, ou cliquez pour parcourir
            </p>
            <Input
              id="design_files"
              name="design_files"
              type="file"
              className="hidden"
              multiple
            />
            <FileUploadButton inputId="design_files" />
            <p className="text-xs text-muted-foreground mt-3">
              Formats supportés: AI, PSD, PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes Additionnelles</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Exigences ou instructions spécifiques pour votre commande"
            rows={4}
            className="bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all resize-none"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className={cn(
          "group relative w-full px-8 py-6 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-lg font-medium overflow-hidden",
          isLoading && "opacity-90 pointer-events-none"
        )}
        disabled={isLoading}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            "Passer la Commande"
          )}
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <p className="text-sm text-muted-foreground text-center mt-6">
        En passant cette commande, vous acceptez nos conditions générales. Un acompte peut être requis avant le début de la production.
      </p>
    </form>
  );
}