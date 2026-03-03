import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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

const GTM_WEB_ID = "GTM-PDLS5SL";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_WEB_ID}');`}
        </Script>
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_WEB_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
