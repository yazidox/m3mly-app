"use client";

import Link from "next/link";
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  return (
    <footer
      className="relative overflow-hidden bg-secondary/30 border-t border-border"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-secondary/30" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <Link
              href="/"
              className="flex items-center gap-2 group mb-4 w-[130px]"
            >
              <div className="relative overflow-hidden transition-all duration-300 group-hover:scale-105">
                <img
                  src="/logo.svg"
                  alt="M3mly Logo"
                  className="h-full w-full"
                />
                <div
                  className={`absolute -inset-1 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary/10 to-accent/10 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300`}
                />
              </div>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6 leading-relaxed">
              {isRtl 
                ? "ربط الشركات الصغيرة للملابس بمصانع الملابس المغربية للإنتاج السلس."
                : "Connexion des petites entreprises de vêtements avec des usines de vêtements marocaines pour une production fluide."}
            </p>
            <div className={`flex ${isRtl ? "space-x-reverse" : ""} space-x-4`}>
              <a
                href="#"
                className="bg-secondary/80 p-2 rounded-full text-foreground/70 hover:text-primary transition-colors hover:bg-secondary border border-border/50 hover:border-primary/30 hover:scale-110 duration-300"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary/80 p-2 rounded-full text-foreground/70 hover:text-primary transition-colors hover:bg-secondary border border-border/50 hover:border-primary/30 hover:scale-110 duration-300"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary/80 p-2 rounded-full text-foreground/70 hover:text-primary transition-colors hover:bg-secondary border border-border/50 hover:border-primary/30 hover:scale-110 duration-300"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary/80 p-2 rounded-full text-foreground/70 hover:text-primary transition-colors hover:bg-secondary border border-border/50 hover:border-primary/30 hover:scale-110 duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {/* Platform Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Sparkles
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} text-primary`}
                />
                {isRtl ? "المنصة" : "Plateforme"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "تصفح المصانع" : "Parcourir les usines"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "كيف تعمل" : "Comment ça marche"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "لوحة التحكم" : "Tableau de bord"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "التسعير" : "Tarification"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Businesses Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Sparkles
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} text-primary`}
                />
                {isRtl ? "للشركات" : "Pour les entreprises"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "طلب عينات" : "Demander des échantillons"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "تتبع الطلب" : "Suivi de commande"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "حماية الدفع" : "Protection des paiements"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "قصص النجاح" : "Histoires de réussite"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Factories Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Sparkles
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} text-primary`}
                />
                {isRtl ? "للمصانع" : "Pour les usines"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "انضم كمصنع" : "Rejoindre en tant qu'usine"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "لوحة تحكم المصنع" : "Tableau de bord de l'usine"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "إدارة الطلبات" : "Gestion des commandes"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "عرض المحفظة" : "Présenter le portfolio"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center">
                <Sparkles
                  className={`w-4 h-4 ${isRtl ? "ml-2" : "mr-2"} text-primary`}
                />
                {isRtl ? "الشركة" : "Entreprise"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "عن M3mly" : "À propos de M3mly"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "اتصل بنا" : "Contactez-nous"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "سياسة الخصوصية" : "Politique de confidentialité"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                  >
                    <span>{isRtl ? "شروط الخدمة" : "Conditions d'utilisation"}</span>
                    <span
                      className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[2px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 backdrop-blur-sm">
          <div className="text-muted-foreground mb-4 md:mb-0">
            © {currentYear} M3mly. {isRtl ? "جميع الحقوق محفوظة" : "Tous droits réservés"}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
            >
              <span>{isRtl ? "سياسة الخصوصية" : "Politique de confidentialité"}</span>
              <span
                className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[1px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
              ></span>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
            >
              <span>{isRtl ? "شروط الخدمة" : "Conditions d'utilisation"}</span>
              <span
                className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[1px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
              ></span>
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
            >
              <span>{isRtl ? "ملفات تعريف الارتباط" : "Cookies"}</span>
              <span
                className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-[1px] w-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent transition-all duration-300 group-hover:w-full`}
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
