import type { Metadata, Viewport } from "next";
import { Anton, Cinzel, Montserrat } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--fonte-anton", display: "swap" });
const montserrat = Montserrat({ weight: ["500", "600", "800"], subsets: ["latin"], variable: "--fonte-montserrat", display: "swap" });
const cinzel = Cinzel({ weight: "600", subsets: ["latin"], variable: "--fonte-cinzel", display: "swap" });

const descricao = "Site oficial do Prado FC, time de society e futsal do bairro Prado, em Belo Horizonte. Jogos, resultados, estatísticas, elenco e notícias.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Prado FC · Foco, garra e amizade", template: "%s · Prado FC" },
  description: descricao,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Prado FC", description: descricao },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#1a1030" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${montserrat.variable} ${cinzel.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
