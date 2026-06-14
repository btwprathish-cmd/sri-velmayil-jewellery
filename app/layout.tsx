import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup, { getOrganizationSchema } from "@/components/SchemaMarkup";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://srivelmayiljewellery.com"),
  title: {
    default: "Sri Velmayil Jewellery | Premium Gold Shop in Tirupur",
    template: "%s | Sri Velmayil Jewellery"
  },
  description: "Sri Velmayil Jewellery in Tirupur offers 100% BIS Hallmarked 916 gold jewellery, wedding collections, and live daily gold rate updates. Trust since generations.",
  keywords: "gold rate today Tirupur, Sri Velmayil Jewellery, jewellery shop in Tirupur, BIS 916 gold, bridal jewellery Tirupur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#0c0418] text-[#fbf6e8] antialiased flex flex-col min-h-screen selection:bg-[#D4AF37] selection:text-[#1a0b2e]">
        {/* Global Organization Schema */}
        <SchemaMarkup data={getOrganizationSchema()} />
        
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
