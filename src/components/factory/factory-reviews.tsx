"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface FactoryReviewsProps {
  factory: any;
}

export default function FactoryReviews({ factory }: FactoryReviewsProps) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const defaultReviews = [
    {
      id: 1,
      author: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 5,
      date: "15/10/2023",
      comment: "Excellente qualité et communication. Notre commande a été livrée à temps et a dépassé nos attentes. Nous travaillerons certainement à nouveau avec eux.",
      comment_ar: "جودة ممتازة وتواصل رائع. تم تسليم طلبنا في الوقت المحدد وتجاوز توقعاتنا. سنعمل بالتأكيد معهم مرة أخرى."
    },
    {
      id: 2,
      author: "Michel Dupont",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 4,
      date: "22/09/2023",
      comment: "Bonne expérience dans l'ensemble. Les produits étaient bien fabriqués, bien qu'il y ait eu un léger retard dans l'expédition. La communication était excellente tout au long du processus.",
      comment_ar: "تجربة جيدة بشكل عام. كانت المنتجات مصنوعة جيدًا، على الرغم من وجود تأخير طفيف في الشحن. كان التواصل ممتازًا طوال العملية."
    },
    {
      id: 3,
      author: "Emma Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      rating: 5,
      date: "30/08/2023",
      comment: "Incroyable attention aux détails. Nos designs personnalisés ont été parfaitement exécutés, et l'usine a été très accommodante avec nos révisions.",
      comment_ar: "اهتمام مذهل بالتفاصيل. تم تنفيذ تصميماتنا المخصصة بشكل مثالي، وكان المصنع متعاونًا جدًا مع مراجعاتنا."
    },
  ];

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isRtl ? "آراء العملاء" : "Avis clients"}
        </h2>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="fill-amber-500" size={18} />
          <span className="font-medium">
            {factory.rating || 4.5}
          </span>
          <span className="text-muted-foreground text-sm">
            ({factory.review_count || 0})
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {(factory.reviews || defaultReviews).map((review: any) => (
          <div
            key={review.id}
            className="border-b border-border pb-6 last:border-0"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{review.author}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground/30"
                            }
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className={cn("mt-2 text-muted-foreground", isRtl && "text-right")}>
                  {isRtl && review.comment_ar ? review.comment_ar : review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="mt-4 w-full">
        {isRtl ? "عرض جميع التقييمات" : "Voir tous les avis"}
      </Button>
    </div>
  );
} 