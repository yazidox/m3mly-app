import Link from "next/link";
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";
import { t } from "@/lib/i18n/server";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <Link
              href="/"
              className="text-2xl font-bold text-primary mb-4 block"
            >
              M3mly
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6">
              Connecting small clothing businesses with Moroccan garment
              factories for seamless production.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-secondary p-2 rounded-full text-foreground/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary p-2 rounded-full text-foreground/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary p-2 rounded-full text-foreground/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-secondary p-2 rounded-full text-foreground/70 hover:text-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {/* Platform Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                {t("common.platform")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.browse_factories")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.how_it_works")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.dashboard")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.pricing")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Businesses Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                {t("common.for_businesses")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.request_samples")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.order_tracking")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.payment_protection")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.success_stories")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Factories Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                {t("common.for_factories")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.join_as_factory")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.factory_dashboard")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.order_management")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.showcase_portfolio")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                {t("common.company")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.about_m3mly")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.contact_us")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.privacy_policy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.terms_of_service")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="text-muted-foreground mb-4 md:mb-0">
            © {currentYear} M3mly. {t("common.all_rights_reserved")}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
