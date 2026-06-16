import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Clock, Calendar, ShieldCheck } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import { getRateByDate, getAllRates } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";
import { getSeoMetadata } from "@/utils/seo";

interface DatePageProps {
  params: Promise<{ date: string }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const rates = await getAllRates();
  return rates.map((rate) => ({ date: rate.date }));
}

export async function generateMetadata({ params }: DatePageProps) {
  const { date } = await params;
  const rate = await getRateByDate(date);
  if (!rate) return {};

  const formattedDate = formatIndianDate(date);
  return getSeoMetadata({
    title: `Gold Rate on ${formattedDate} in Tirupur | Historical Prices`,
    description: `Check the gold and silver rates recorded on ${formattedDate} in Tirupur, Tamil Nadu. View 22K daily gold price per gram and sovereign rates at Sri Velmayil Jewellery.`,
    path: `/gold-rate/${date}`
  });
}

export default async function DateRatePage({ params }: DatePageProps) {
  const { date } = await params;
  const rate = await getRateByDate(date);
  if (!rate) {
    notFound();
  }

  const formattedDate = formatIndianDate(date);
  const gold24k_1g = Math.round(rate.gold22k_1g / 0.916);
  const gold18k_1g = Math.round(rate.gold22k_1g * (18 / 22));

  // Dynamic FAQ for specific date
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What was the 22K gold rate in Tirupur on ${formattedDate}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `On ${formattedDate}, the 22K gold rate at Sri Velmayil Jewellery in Tirupur was ₹${rate.gold22k_1g.toLocaleString("en-IN")} per gram and ₹${rate.gold22k_8g.toLocaleString("en-IN")} for a 8-gram sovereign.`
        }
      },
      {
        "@type": "Question",
        "name": `What was the silver price in Tirupur on ${formattedDate}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price of fine silver in Tirupur on ${formattedDate} was ₹${rate.silver_1g.toLocaleString("en-IN")} per 1 gram.`
        }
      }
    ]
  };

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Today's Gold Rate", item: "https://srivelmayiljewellery.com/gold-rate-today-tirupur" },
    { name: "Gold Rate History", item: "https://srivelmayiljewellery.com/gold-rate-history" },
    { name: `Rate on ${formattedDate}`, item: `https://srivelmayiljewellery.com/gold-rate/${date}` }
  ]);

  return (
    <>
      {/* Inject Schemas */}
      <SchemaMarkup data={faqSchema} />
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/gold-rate-history"
            className="inline-flex items-center text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rate History
          </Link>
        </div>

        {/* Board Rate Card */}
        <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center space-x-2 text-[#D4AF37] mb-4 text-xs font-bold font-sans uppercase tracking-widest">
            <Calendar className="h-4 w-4" />
            <span>Archive Pricing Index</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-2">
            Gold Rate on {formattedDate}
          </h1>
          <p className="text-xs text-[#F3E5AB]/60 font-sans mb-8">
            Recorded price list in Tirupur, Tamil Nadu. Verified at Sri Velmayil Jewellery.
          </p>

          <div className="space-y-4 font-sans mb-8">
            {/* 22K */}
            <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
              <div>
                <span className="font-bold text-base text-white">22K Gold (916 Hallmarked)</span>
                <p className="text-[10px] text-[#F3E5AB]/50">Ornaments Rate</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">
                  ₹{rate.gold22k_1g.toLocaleString("en-IN")}
                </span>
                <p className="text-[9px] text-[#F3E5AB]/50">Per 1 Gram</p>
              </div>
            </div>

            {/* 22K 8g */}
            <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
              <div>
                <span className="font-bold text-base text-white">22K Gold (Sovereign Board Rate)</span>
                <p className="text-[10px] text-[#F3E5AB]/50">8 Gram Sovereign</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">
                  ₹{rate.gold22k_8g.toLocaleString("en-IN")}
                </span>
                <p className="text-[9px] text-[#F3E5AB]/50">Per 8 Grams</p>
              </div>
            </div>

            {/* 24K */}
            <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
              <div>
                <span className="font-bold text-base text-white">24K Pure Gold (99.9%)</span>
                <p className="text-[10px] text-[#F3E5AB]/50">Bullion / Coin Rate</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">
                  ₹{gold24k_1g.toLocaleString("en-IN")}
                </span>
                <p className="text-[9px] text-[#F3E5AB]/50">Per 1 Gram</p>
              </div>
            </div>

            {/* Silver */}
            <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
              <div>
                <span className="font-bold text-base text-white">Fine Silver (99.9%)</span>
                <p className="text-[10px] text-[#F3E5AB]/50">Per Gram Price</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">
                  ₹{rate.silver_1g.toLocaleString("en-IN")}
                </span>
                <p className="text-[9px] text-[#F3E5AB]/50">Per 1 Gram</p>
              </div>
            </div>
          </div>

          {/* Price details footer */}
          <div className="border-t border-[#D4AF37]/15 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#F3E5AB]/50 font-sans gap-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-[#D4AF37] mr-1.5" />
              <span>Registered on: {rate.date}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Trend:</span>
              {(rate.trend_gold ?? 0) !== 0 ? (
                <span className={`inline-flex items-center font-bold ${
                  (rate.trend_gold ?? 0) > 0 ? "text-red-400" : "text-emerald-400"
                }`}>
                  {(rate.trend_gold ?? 0) > 0 ? (
                    <>
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      +{rate.trend_gold}
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                      {rate.trend_gold}
                    </>
                  )}
                  (Gold/g)
                </span>
              ) : (
                <span>Unchanged</span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="mt-8 text-center bg-[#1a0b2e]/30 border border-[#D4AF37]/10 p-6 rounded-2xl">
          <p className="text-xs text-[#F3E5AB]/65 font-sans mb-3">
            Looking for today's current live board rates? Check our main rate dashboard.
          </p>
          <Link
            href="/gold-rate-today-tirupur"
            className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
          >
            Today's Gold Rate
          </Link>
        </div>
      </div>
    </>
  );
}
