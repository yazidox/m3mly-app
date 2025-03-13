import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { Factory, Search, UserCircle, Menu } from "lucide-react";
import UserProfile from "./user-profile";
import { t } from "@/lib/i18n/server";
import LanguageSwitcher from "./language-switcher";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-border bg-background/80 backdrop-blur-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-2xl font-bold text-primary">
          M3mly
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/factories"
            className="text-foreground/70 hover:text-foreground font-medium transition-colors"
          >
            {t("common.browse_factories")}
          </Link>
          <Link
            href="/#how-it-works"
            className="text-foreground/70 hover:text-foreground font-medium transition-colors"
          >
            {t("common.how_it_works")}
          </Link>
          <Link
            href="/#pricing"
            className="text-foreground/70 hover:text-foreground font-medium transition-colors"
          >
            {t("common.pricing")}
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="secondary" className="shadow-sm hover-lift">
                  {t("common.dashboard")}
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {t("common.sign_in")}
              </Link>
              <Link href="/sign-up">
                <Button className="shadow-sm hover-lift">
                  {t("common.sign_up")}
                </Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
