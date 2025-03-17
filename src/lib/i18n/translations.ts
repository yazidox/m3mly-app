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
  | "common.menu"
  | "common.language"
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
  | "footer.terms_of_service"
  | "dashboard.welcome"
  | "dashboard.overview"
  | "dashboard.orders"
  | "dashboard.samples"
  | "dashboard.invoices"
  | "dashboard.shipments"
  | "dashboard.payment_methods"
  | "dashboard.profile"
  | "dashboard.settings"
  | "dashboard.logout"
  | "dashboard.recent_orders"
  | "dashboard.recent_samples"
  | "dashboard.total_spent"
  | "dashboard.next_delivery"
  | "dashboard.view_all"
  | "dashboard.no_orders"
  | "dashboard.no_samples"
  | "dashboard.profile_overview"
  | "dashboard.shipping_address"
  | "dashboard.account_details"
  | "dashboard.member_since"
  | "dashboard.account_type"
  | "dashboard.edit_profile"
  | "dashboard.explore_factories"
  | "dashboard.discover_partners"
  | "dashboard.min_order"
  | "dashboard.view_details"
  | "dashboard.status_pending"
  | "dashboard.status_processing"
  | "dashboard.status_completed"
  | "dashboard.status_cancelled"
  | "factories.hero_tagline"
  | "factories.hero_title"
  | "factories.hero_title_highlight"
  | "factories.hero_description"
  | "factories.factories_count"
  | "factories.search_placeholder"
  | "factories.sort_button"
  | "factories.filters_title"
  | "factories.categories_title"
  | "factories.view_more"
  | "factories.location_title"
  | "factories.moq_title"
  | "factories.units_label"
  | "factories.rating_title"
  | "factories.reset_button"
  | "factories.apply_button"
  | "factories.load_more_button"
  | "factories.no_factories_title"
  | "factories.no_factories_description"
  | "factories.reset_filters_button"
  | "factory_products.back_to_profile"
  | "factory_products.products_of"
  | "factory_products.discover_products"
  | "factory_products.no_products"
  | "factory_products.no_products_description"
  | "products.catalog_title"
  | "products.discover_title"
  | "products.discover_highlight"
  | "products.description"
  | "products.search_placeholder"
  | "products.search_button"
  | "products.filter_button"
  | "products.view_factories"
  | "products.back_to_admin"
  | "products.categories_title"
  | "products.all_products"
  | "products.featured_products"
  | "products.display_count"
  | "products.in_category"
  | "products.matching_search"
  | "products.grid_view"
  | "products.list_view"
  | "products.no_products_title"
  | "products.no_products_description"
  | "products.view_all_products"
  | "products.view_details"
  | "products.min_order"
  | "products.lead_time"
  | "products.units"
  | "products.days";

type TranslationsType = {
  [key in Locale]: {
    [key in TranslationKey]: string;
  };
};

export const translations: TranslationsType = {
  fr: {
    "common.browse_factories": "Parcourir les produits",
    "common.how_it_works": "Comment ça marche",
    "common.pricing": "Tarification",
    "common.dashboard": "Tableau de bord",
    "common.sign_in": "Se connecter",
    "common.sign_up": "S'inscrire",
    "common.find_factories": "Trouver des usines",
    "common.join_as_factory": "Rejoindre en tant qu'usine",
    "common.no_minimum_orders": "Pas de commandes minimum",
    "common.secure_payment": "Paiement sécurisé",
    "common.quality_guaranteed": "Qualité garantie",
    "common.platform": "Plateforme",
    "common.for_businesses": "Pour les entreprises",
    "common.for_factories": "Pour les usines",
    "common.company": "Entreprise",
    "common.all_rights_reserved": "Tous droits réservés",
    "common.menu": "Menu",
    "common.language": "Langue",
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
    "dashboard.welcome": "Bienvenue",
    "dashboard.overview": "Aperçu",
    "dashboard.orders": "Mes Commandes",
    "dashboard.samples": "Demandes d'Échantillons",
    "dashboard.invoices": "Factures",
    "dashboard.shipments": "Expéditions",
    "dashboard.payment_methods": "Méthodes de Paiement",
    "dashboard.profile": "Profil",
    "dashboard.settings": "Paramètres",
    "dashboard.logout": "Se déconnecter",
    "dashboard.recent_orders": "Commandes Récentes",
    "dashboard.recent_samples": "Demandes d'Échantillons Récentes",
    "dashboard.total_spent": "Total Dépensé",
    "dashboard.next_delivery": "Prochaine Livraison",
    "dashboard.view_all": "Voir Tout",
    "dashboard.no_orders": "Pas encore de commandes",
    "dashboard.no_samples": "Pas encore de demandes d'échantillons",
    "dashboard.profile_overview": "Aperçu du Profil",
    "dashboard.shipping_address": "Adresse de Livraison",
    "dashboard.account_details": "Détails du Compte",
    "dashboard.member_since": "Membre depuis",
    "dashboard.account_type": "Type de compte",
    "dashboard.edit_profile": "Modifier le Profil",
    "dashboard.explore_factories": "Explorer les Usines",
    "dashboard.discover_partners": "Découvrir des partenaires de fabrication",
    "dashboard.min_order": "Min",
    "dashboard.view_details": "Voir Détails",
    "dashboard.status_pending": "En attente",
    "dashboard.status_processing": "En traitement",
    "dashboard.status_completed": "Terminé",
    "dashboard.status_cancelled": "Annulé",
    "factories.hero_tagline": "Trouvez votre partenaire de fabrication idéal",
    "factories.hero_title": "Explorez nos",
    "factories.hero_title_highlight": "usines",
    "factories.hero_description": "Découvrez et connectez-vous avec les meilleurs fabricants de vêtements au Maroc, filtrés pour répondre à vos besoins spécifiques de production.",
    "factories.factories_count": "Affichage de",
    "factories.search_placeholder": "Rechercher des usines...",
    "factories.sort_button": "Trier",
    "factories.filters_title": "Filtres",
    "factories.categories_title": "Catégories",
    "factories.view_more": "Voir plus",
    "factories.location_title": "Emplacement",
    "factories.moq_title": "Quantité minimale de commande",
    "factories.units_label": "unités",
    "factories.rating_title": "Évaluation",
    "factories.reset_button": "Réinitialiser",
    "factories.apply_button": "Appliquer",
    "factories.load_more_button": "Charger plus",
    "factories.no_factories_title": "Aucune usine trouvée",
    "factories.no_factories_description": "Il n'y a actuellement aucune usine disponible correspondant à vos critères. Essayez d'ajuster vos filtres ou revenez plus tard.",
    "factories.reset_filters_button": "Réinitialiser les filtres",
    "factory_products.back_to_profile": "Retour au profil de l'usine",
    "factory_products.products_of": "Produits de",
    "factory_products.discover_products": "Découvrez tous les produits disponibles de {factoryName} et commandez directement en ligne",
    "factory_products.no_products": "Aucun produit disponible",
    "factory_products.no_products_description": "Cette usine n'a pas encore ajouté de produits. Veuillez vérifier plus tard ou les contacter directement pour des commandes personnalisées.",
    "products.catalog_title": "Catalogue de produits",
    "products.discover_title": "Découvrez nos",
    "products.discover_highlight": "vêtements",
    "products.description": "Parcourez notre collection de vêtements de haute qualité provenant des meilleurs fabricants marocains à des prix imbattables.",
    "products.search_placeholder": "Rechercher des produits...",
    "products.search_button": "Rechercher",
    "products.filter_button": "Filtrer",
    "products.view_factories": "Voir les usines",
    "products.back_to_admin": "Retour à l'administration",
    "products.categories_title": "Catégories",
    "products.all_products": "Tous les produits",
    "products.featured_products": "Produits en vedette",
    "products.display_count": "Affichage de",
    "products.in_category": "dans",
    "products.matching_search": "correspondant à",
    "products.grid_view": "Grille",
    "products.list_view": "Liste",
    "products.no_products_title": "Aucun produit trouvé",
    "products.no_products_description": "Il n'y a pas de produits disponibles pour le moment",
    "products.view_all_products": "Voir tous les produits",
    "products.view_details": "Voir détails",
    "products.min_order": "Commande min",
    "products.lead_time": "Délai",
    "products.units": "unités",
    "products.days": "jours",
  },
  ar: {
    "common.browse_factories": "تصفح المنتجات",
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
    "common.menu": "القائمة",
    "common.language": "اللغة",
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
    "dashboard.welcome": "مرحبًا",
    "dashboard.overview": "نظرة عامة",
    "dashboard.orders": "طلباتي",
    "dashboard.samples": "طلبات العينات",
    "dashboard.invoices": "الفواتير",
    "dashboard.shipments": "الشحنات",
    "dashboard.payment_methods": "طرق الدفع",
    "dashboard.profile": "الملف الشخصي",
    "dashboard.settings": "الإعدادات",
    "dashboard.logout": "تسجيل الخروج",
    "dashboard.recent_orders": "الطلبات الأخيرة",
    "dashboard.recent_samples": "طلبات العينات الأخيرة",
    "dashboard.total_spent": "إجمالي المصروفات",
    "dashboard.next_delivery": "التسليم القادم",
    "dashboard.view_all": "عرض الكل",
    "dashboard.no_orders": "لا توجد طلبات حتى الآن",
    "dashboard.no_samples": "لا توجد طلبات عينات حتى الآن",
    "dashboard.profile_overview": "نظرة عامة على الملف الشخصي",
    "dashboard.shipping_address": "عنوان الشحن",
    "dashboard.account_details": "تفاصيل الحساب",
    "dashboard.member_since": "عضو منذ",
    "dashboard.account_type": "نوع الحساب",
    "dashboard.edit_profile": "تعديل الملف الشخصي",
    "dashboard.explore_factories": "استكشاف المصانع",
    "dashboard.discover_partners": "اكتشاف شركاء التصنيع",
    "dashboard.min_order": "الحد الأدنى",
    "dashboard.view_details": "عرض التفاصيل",
    "dashboard.status_pending": "قيد الانتظار",
    "dashboard.status_processing": "قيد المعالجة",
    "dashboard.status_completed": "مكتمل",
    "dashboard.status_cancelled": "ملغي",
    "factories.hero_tagline": "ابحث عن شريك التصنيع المثالي",
    "factories.hero_title": "استكشف",
    "factories.hero_title_highlight": "مصانعنا",
    "factories.hero_description": "اكتشف وتواصل مع أفضل مصنعي الملابس في المغرب، مصنفين لتلبية احتياجات الإنتاج الخاصة بك.",
    "factories.factories_count": "عرض",
    "factories.search_placeholder": "البحث عن المصانع...",
    "factories.sort_button": "فرز",
    "factories.filters_title": "المرشحات",
    "factories.categories_title": "الفئات",
    "factories.view_more": "عرض المزيد",
    "factories.location_title": "الموقع",
    "factories.moq_title": "الحد الأدنى لكمية الطلب",
    "factories.units_label": "وحدات",
    "factories.rating_title": "التقييم",
    "factories.reset_button": "إعادة تعيين",
    "factories.apply_button": "تطبيق",
    "factories.load_more_button": "تحميل المزيد",
    "factories.no_factories_title": "لم يتم العثور على مصانع",
    "factories.no_factories_description": "لا توجد حاليًا أي مصانع متاحة تطابق معاييرك. حاول ضبط المرشحات أو العودة لاحقًا.",
    "factories.reset_filters_button": "إعادة تعيين المرشحات",
    "factory_products.back_to_profile": "العودة إلى ملف المصنع",
    "factory_products.products_of": "منتجات",
    "factory_products.discover_products": "اكتشف جميع المنتجات المتاحة من {factoryName} واطلب مباشرة عبر الإنترنت",
    "factory_products.no_products": "لا توجد منتجات متاحة",
    "factory_products.no_products_description": "هذا المصنع لم يضف أي منتجات بعد. يرجى التحقق لاحقًا أو الاتصال بهم مباشرة للطلبات المخصصة.",
    "products.catalog_title": "كتالوج المنتجات",
    "products.discover_title": "اكتشف",
    "products.discover_highlight": "ملابسنا",
    "products.description": "تصفح مجموعتنا من الملابس عالية الجودة من أفضل المصنعين المغاربة بأسعار لا تقبل المنافسة.",
    "products.search_placeholder": "البحث عن المنتجات...",
    "products.search_button": "بحث",
    "products.filter_button": "تصفية",
    "products.view_factories": "عرض المصانع",
    "products.back_to_admin": "العودة إلى الإدارة",
    "products.categories_title": "الفئات",
    "products.all_products": "جميع المنتجات",
    "products.featured_products": "منتجات مميزة",
    "products.display_count": "عرض",
    "products.in_category": "في",
    "products.matching_search": "مطابق لـ",
    "products.grid_view": "شبكة",
    "products.list_view": "قائمة",
    "products.no_products_title": "لم يتم العثور على منتجات",
    "products.no_products_description": "لا توجد منتجات متاحة حاليًا",
    "products.view_all_products": "عرض جميع المنتجات",
    "products.view_details": "عرض التفاصيل",
    "products.min_order": "الحد الأدنى للطلب",
    "products.lead_time": "مدة التسليم",
    "products.units": "وحدات",
    "products.days": "أيام",
  },
};
