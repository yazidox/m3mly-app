import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/client";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n/translations";
import ClientLanguageProvider from "@/components/client-language-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "M3mly - Plateforme de fabrication de vêtements B2B",
  description:
    "Une plateforme connectant les petites entreprises de vêtements avec des usines de confection marocaines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get("locale");
  const locale = (localeCookie?.value as Locale) || "fr";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={locale}>
            <ClientLanguageProvider />
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
