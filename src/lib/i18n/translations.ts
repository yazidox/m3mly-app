export type Locale = "fr" | "ar";

export type TranslationKey =
  | "common.browse_factories"
  | "common.how_it_works"
  | "common.pricing"
  | "common.dashboard"
  | "common.sign_in"
  | "common.sign_up"
  | "common.find_factories"
  | "common.join_as_factory"
  | "common.no_minimum_orders"
  | "common.secure_payment"
  | "common.quality_guaranteed"
  | "common.platform"
  | "common.for_businesses"
  | "common.for_factories"
  | "common.company"
  | "common.all_rights_reserved"
  | "hero.connect_with"
  | "hero.moroccan"
  | "hero.garment_factories"
  | "hero.description"
  | "footer.browse_factories"
  | "footer.how_it_works"
  | "footer.dashboard"
  | "footer.pricing"
  | "footer.request_samples"
  | "footer.order_tracking"
  | "footer.payment_protection"
  | "footer.success_stories"
  | "footer.join_as_factory"
  | "footer.factory_dashboard"
  | "footer.order_management"
  | "footer.showcase_portfolio"
  | "footer.about_m3mly"
  | "footer.contact_us"
  | "footer.privacy_policy"
  | "footer.terms_of_service";

type TranslationsType = {
  [key in Locale]: {
    [key in TranslationKey]: string;
  };
};

export const translations: TranslationsType = {
  fr: {
    "common.browse_factories": "Parcourir les usines",
    "common.how_it_works": "Comment ça marche",
    "common.pricing": "Tarification",
    "common.dashboard": "Tableau de bord",
    "common.sign_in": "Se connecter",
    "common.sign_up": "S'inscrire",
    "common.find_factories": "Trouver des usines",
    "common.join_as_factory": "Rejoindre en tant qu'usine",
    "common.no_minimum_orders": "Pas de commandes minimales",
    "common.secure_payment": "Paiement sécurisé",
    "common.quality_guaranteed": "Qualité garantie",
    "common.platform": "Plateforme",
    "common.for_businesses": "Pour les entreprises",
    "common.for_factories": "Pour les usines",
    "common.company": "Entreprise",
    "common.all_rights_reserved": "Tous droits réservés",
    "hero.connect_with": "Connectez-vous avec",
    "hero.moroccan": "marocaines",
    "hero.garment_factories": "des usines de vêtements",
    "hero.description":
      "M3mly connecte les petites entreprises de vêtements avec les meilleurs fabricants marocains. Concevez, produisez et développez votre ligne de vêtements en un seul endroit.",
    "footer.browse_factories": "Parcourir les usines",
    "footer.how_it_works": "Comment ça marche",
    "footer.dashboard": "Tableau de bord",
    "footer.pricing": "Tarification",
    "footer.request_samples": "Demander des échantillons",
    "footer.order_tracking": "Suivi de commande",
    "footer.payment_protection": "Protection des paiements",
    "footer.success_stories": "Histoires de réussite",
    "footer.join_as_factory": "Rejoindre en tant qu'usine",
    "footer.factory_dashboard": "Tableau de bord d'usine",
    "footer.order_management": "Gestion des commandes",
    "footer.showcase_portfolio": "Présenter le portfolio",
    "footer.about_m3mly": "À propos de M3mly",
    "footer.contact_us": "Contactez-nous",
    "footer.privacy_policy": "Politique de confidentialité",
    "footer.terms_of_service": "Conditions d'utilisation",
  },
  ar: {
    "common.browse_factories": "تصفح المصانع",
    "common.how_it_works": "كيف يعمل",
    "common.pricing": "التسعير",
    "common.dashboard": "لوحة التحكم",
    "common.sign_in": "تسجيل الدخول",
    "common.sign_up": "إنشاء حساب",
    "common.find_factories": "البحث عن مصانع",
    "common.join_as_factory": "انضم كمصنع",
    "common.no_minimum_orders": "لا حد أدنى للطلبات",
    "common.secure_payment": "دفع آمن",
    "common.quality_guaranteed": "جودة مضمونة",
    "common.platform": "المنصة",
    "common.for_businesses": "للشركات",
    "common.for_factories": "للمصانع",
    "common.company": "الشركة",
    "common.all_rights_reserved": "جميع الحقوق محفوظة",
    "hero.connect_with": "تواصل مع",
    "hero.moroccan": "المغربية",
    "hero.garment_factories": "مصانع الملابس",
    "hero.description":
      "تربط منصة M3mly الشركات الصغيرة للملابس مع أفضل المصنعين المغاربة. صمم وأنتج وطور خط الملابس الخاص بك في مكان واحد.",
    "footer.browse_factories": "تصفح المصانع",
    "footer.how_it_works": "كيف يعمل",
    "footer.dashboard": "لوحة التحكم",
    "footer.pricing": "التسعير",
    "footer.request_samples": "طلب عينات",
    "footer.order_tracking": "تتبع الطلب",
    "footer.payment_protection": "حماية الدفع",
    "footer.success_stories": "قصص النجاح",
    "footer.join_as_factory": "انضم كمصنع",
    "footer.factory_dashboard": "لوحة تحكم المصنع",
    "footer.order_management": "إدارة الطلبات",
    "footer.showcase_portfolio": "عرض المحفظة",
    "footer.about_m3mly": "عن M3mly",
    "footer.contact_us": "اتصل بنا",
    "footer.privacy_policy": "سياسة الخصوصية",
    "footer.terms_of_service": "شروط الخدمة",
  },
};
