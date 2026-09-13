import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { BootScript } from "@/components/BootScript";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { GtmLoader } from "@/components/analytics/GtmLoader";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/motion/PageTransition";
import { SessionOpening } from "@/components/motion/SessionOpening";
import { site, siteUrl } from "@/lib/site";
import { colors } from "@/lib/tokens";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

// TODO(fonte): Cormorant Garamond é a display provisória até a licença web da Guton ser confirmada.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: colors.bege,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col">
        <BootScript />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {/* O banner fica fixo no pé da tela, mas vem logo depois do atalho na ordem de foco:
            quem usa teclado escolhe sem atravessar a página inteira. */}
        <ConsentBanner />
        <SessionOpening />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <PageTransition />
        <GtmLoader />
      </body>
    </html>
  );
}
