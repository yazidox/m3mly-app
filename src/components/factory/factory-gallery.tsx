"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface FactoryGalleryProps {
  factory: any;
}

export default function FactoryGallery({ factory }: FactoryGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const defaultGallery = [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
    "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=600&q=80",
    "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=600&q=80",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
  ];

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <h2 className="text-xl font-semibold mb-4">
        {isRtl ? "معرض صور المصنع" : "Galerie de l'usine"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(factory.gallery || defaultGallery).map((image: string, index: number) => (
          <div
            key={index}
            className="relative h-48 rounded-lg overflow-hidden border border-border group"
          >
            <Image
              src={image}
              alt={isRtl ? `صورة المعرض ${index + 1}` : `Image de galerie ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 