import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easycao.com"),
  title: "Easycao — Domine a prova ICAO. Na prática.",
  description:
    "Participe das lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO. Preparação com Diogo Verzola, examinador ICAO credenciado.",
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Easycao — Domine a prova ICAO. Na prática.",
    description:
      "Lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO.",
    url: "https://easycao.com/lives",
    siteName: "Easycao",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Easycao — Domine a prova ICAO",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easycao — Domine a prova ICAO. Na prática.",
    description:
      "Lives semanais gratuitas com aulas ao vivo e simulados da prova ICAO.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <GoogleTagManager gtmId="GTM-PDLS5SL" />
      </body>
    </html>
  );
}
