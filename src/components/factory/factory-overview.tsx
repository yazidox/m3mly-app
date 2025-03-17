"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Factory, FileText, Package, Truck, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import Scissors from "@/components/scissors";

interface FactoryOverviewProps {
  factory: any;
}

export default function FactoryOverview({ factory }: FactoryOverviewProps) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const services = [
    {
      icon: <Scissors size={18} />,
      fr: "Création de patrons",
      ar: "إنشاء الأنماط",
    },
    {
      icon: <FileText size={18} />,
      fr: "Développement d'échantillons",
      ar: "تطوير العينات",
    },
    {
      icon: <Users size={18} />,
      fr: "Production en petite série",
      ar: "إنتاج بكميات صغيرة",
    },
    {
      icon: <Factory size={18} />,
      fr: "Production de masse",
      ar: "الإنتاج الضخم",
    },
    { 
      icon: <Package size={18} />, 
      fr: "Emballage",
      ar: "التعبئة والتغليف",
    },
    {
      icon: <Truck size={18} />,
      fr: "Expédition & Logistique",
      ar: "الشحن والخدمات اللوجستية",
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isRtl ? `عن ${factory.name}` : `À propos de ${factory.name}`}
        </h2>
        <p className={cn("text-muted-foreground mb-6", isRtl && "text-right")}>{factory.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className={cn("text-lg font-medium mb-3", isRtl && "text-right")}>
              {isRtl ? "التخصصات" : "Spécialités"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(factory.specialties || []).map((specialty: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className={cn("text-lg font-medium mb-3", isRtl && "text-right")}>
              {isRtl ? "الشهادات" : "Certifications"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(factory.certifications || []).map((cert: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/15 text-accent rounded-full text-sm flex items-center gap-1"
                >
                  <CheckCircle2 size={14} />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {isRtl ? "تفاصيل الإنتاج" : "Détails de production"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Package size={20} />
            </div>
            <div>
              <h3 className={cn("font-medium", isRtl && "text-right")}>
                {isRtl ? "الحد الأدنى للطلب" : "Commande minimum"}
              </h3>
              <p className={cn("text-muted-foreground", isRtl && "text-right")}>
                {factory.min_order_quantity} {isRtl ? "وحدة" : "unités"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <h3 className={cn("font-medium", isRtl && "text-right")}>
                {isRtl ? "مدة الإنتاج" : "Délai de production"}
              </h3>
              <p className={cn("text-muted-foreground", isRtl && "text-right")}>{factory.lead_time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Factory size={20} />
            </div>
            <div>
              <h3 className={cn("font-medium", isRtl && "text-right")}>
                {isRtl ? "قدرة الإنتاج" : "Capacité de production"}
              </h3>
              <p className={cn("text-muted-foreground", isRtl && "text-right")}>{factory.capacity}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {isRtl ? "الخدمات المقدمة" : "Services proposés"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-primary">{item.icon}</div>
              <span>{isRtl ? item.ar : item.fr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 