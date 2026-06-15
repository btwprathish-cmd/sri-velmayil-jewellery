import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup, { getOrganizationSchema } from "@/components/SchemaMarkup";
import DeferredWhatsAppWidget from "@/components/DeferredWhatsAppWidget";
import Script from "next/script";
import { inter, playfair } from "@/app/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://srivelmayiljewellery.com"),
  title: {
    default: "Sri Velmayil Jewellery | Premium Gold Shop in Tirupur",
    template: "%s | Sri Velmayil Jewellery",
  },
  description:
    "Sri Velmayil Jewellery in Tirupur offers 100% BIS Hallmarked 916 gold jewellery, wedding collections, and live daily gold rate updates. Trust since generations.",
  keywords:
    "gold rate today Tirupur, Sri Velmayil Jewellery, jewellery shop in Tirupur, BIS 916 gold, bridal jewellery Tirupur",
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#0c0418] text-[#fbf6e8] antialiased flex flex-col min-h-screen selection:bg-[#D4AF37] selection:text-[#1a0b2e]">
        <SchemaMarkup data={getOrganizationSchema()} />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <DeferredWhatsAppWidget />

        {gaId && gaId !== "G-XXXXXXXXXX" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
