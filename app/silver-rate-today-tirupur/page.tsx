import React from "react";
import Link from "next/link";
import { getSeoMetadata } from "@/utils/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaMarkup from "@/components/SchemaMarkup";
import { getLatestRate, getDerivedRates } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";
import { BRAND } from "@/utils/brand";

export const revalidate = 3600;

export const metadata = getSeoMetadata({
  title: "Silver Rate Today in Tirupur | Live Fine Silver Price",
  description: `Check today's live silver rate in Tirupur at ${BRAND.name}. Fine silver 1 gram price, silver per kg rate, and daily silver price updates.`,
  path: "/silver-rate-today-tirupur",
  keywords: [
    "Silver Rate Today Tirupur",
    "silver price Tirupur",
    "fine silver rate Tirupur",
    "Velmayil Jewellery silver rate",
    "silver per gram Tirupur",
  ],
});

export default async function SilverRateTodayPage() {
  const latestRate = await getLatestRate();
  const derived = getDerivedRates(latestRate);
  const formattedDate = formatIndianDate(latestRate.date);

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is today's silver rate in Tirupur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's fine silver rate at ${BRAND.name} in Tirupur is ₹${latestRate.silver_1g.toLocaleString("en-IN")} per 1 gram.`,
        },
      },
      {
        "@type": "Question",
        name: "What is the silver price per kg in Tirupur today?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Today's silver price per kilogram in Tirupur is ₹${derived.silver_1kg.toLocaleString("en-IN")}.`,
        },
      },
    ],
  };

  return (
    <>
      <SchemaMarkup data={faqData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Silver Rate Today", href: "/silver-rate-today-tirupur" }]} />

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Silver Rate Today in Tirupur
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/75 max-w-xl mx-auto font-sans">
            Live fine silver prices updated for {formattedDate} at {BRAND.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider mb-2">Fine Silver (99.9%)</p>
            <p className="font-serif text-5xl font-bold text-[#D4AF37] font-mono">
              ₹{latestRate.silver_1g.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#F3E5AB]/70 mt-2">Per 1 Gram</p>
          </div>

          <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider mb-2">Silver Bar</p>
            <p className="font-serif text-5xl font-bold text-[#D4AF37] font-mono">
              ₹{derived.silver_1kg.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#F3E5AB]/70 mt-2">Per 1 Kilogram</p>
          </div>
        </div>

        <div className="mt-12 text-center space-x-4">
          <Link
            href="/gold-rate-today-tirupur"
            className="inline-flex items-center px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-all text-sm"
          >
            View Gold Rate Today
          </Link>
          <Link
            href="/gold-rate-history"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg hover:brightness-110 transition-all text-sm"
          >
            View Rate History
          </Link>
        </div>
      </div>
    </>
  );
}
