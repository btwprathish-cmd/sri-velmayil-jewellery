import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Award, History, Landmark, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import RateCalculator from "@/components/RateCalculator";
import { getLatestRate, getAllRates, getDerivedRates } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";
import { getSeoMetadata } from "@/utils/seo";

export const revalidate = 1800;

export const metadata = getSeoMetadata({
  title: "Gold Rate Today in Tirupur | Live 22K & 24K Gold Rates",
  description: "Check today's live 22K & 24K gold rates in Tirupur. Daily gold rate per gram, 8 gram sovereign board prices, and silver rates at Sri Velmayil Jewellery.",
  path: "/gold-rate-today-tirupur"
});

export default async function TodayRatePage() {
  const latestRate = await getLatestRate();
  const rateHistory = await getAllRates();
  const formattedDate = formatIndianDate(latestRate.date);
  const derived = getDerivedRates(latestRate);
  const gold24k_1g = derived.gold24k_1g;
  const gold18k_1g = derived.gold18k_1g;

  // FAQ Schema dynamic answers
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is today's 22K gold rate in Tirupur?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Today's 22K gold rate at Sri Velmayil Jewellery in Tirupur is ₹${latestRate.gold22k_1g.toLocaleString("en-IN")} per 1 gram, and ₹${latestRate.gold22k_8g.toLocaleString("en-IN")} for a 8-gram sovereign.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the price of 24K pure gold in Tirupur today?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Today's 24K pure gold rate in Tirupur is approximately ₹${gold24k_1g.toLocaleString("en-IN")} per 1 gram.`
        }
      },
      {
        "@type": "Question",
        "name": "Is silver price updated daily at Sri Velmayil Jewellery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we update silver prices daily. Today's fine silver price in Tirupur is ₹${latestRate.silver_1g.toLocaleString("en-IN")} per 1 gram.`
        }
      }
    ]
  };

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Today's Gold Rate", item: "https://srivelmayiljewellery.com/gold-rate-today-tirupur" }
  ]);

  return (
    <>
      <SchemaMarkup data={faqData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Gold Rate Today", href: "/gold-rate-today-tirupur" }]} />
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Today's Gold Rate in Tirupur
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/75 max-w-xl mx-auto font-sans">
            Live updates for {formattedDate}. Rates verified at Sri Velmayil Jewellery.
          </p>
        </div>

        {/* Dynamic Rate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Main Rate Cards (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex justify-between items-center mb-6 border-b border-[#D4AF37]/10 pb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Board Rates Summary
                </h2>
                {(latestRate.trend_gold ?? 0) !== 0 && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans ${
                    (latestRate.trend_gold ?? 0) > 0 
                      ? "bg-red-500/10 text-red-400 border border-red-500/25" 
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                  }`}>
                    {(latestRate.trend_gold ?? 0) > 0 ? (
                      <>
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                        Increased by ₹{Math.abs(latestRate.trend_gold ?? 0)}/g
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                        Decreased by ₹{Math.abs(latestRate.trend_gold ?? 0)}/g
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="space-y-4 font-sans">
                {/* 22K Row */}
                <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">22K Gold (916 Hallmarked)</span>
                    <p className="text-xs text-[#F3E5AB]/60">Standard ornament rate</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                      ₹{latestRate.gold22k_1g.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-[#F3E5AB]/50">Per 1 Gram</p>
                  </div>
                </div>

                {/* 24K Row */}
                <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">24K Pure Gold</span>
                    <p className="text-xs text-[#F3E5AB]/60">Coins and bullion bars (99.9% purity)</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                      ₹{gold24k_1g.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-[#F3E5AB]/50">Per 1 Gram</p>
                  </div>
                </div>

                {/* 18K Row */}
                <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">18K Studded Gold</span>
                    <p className="text-xs text-[#F3E5AB]/60">Ideal for stone & diamond settings</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                      ₹{gold18k_1g.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-[#F3E5AB]/50">Per 1 Gram</p>
                  </div>
                </div>

                {/* Silver Row */}
                <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">Silver (1 Gram)</span>
                    <p className="text-xs text-[#F3E5AB]/60">Fine silver articles (99.9% purity)</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                      ₹{latestRate.silver_1g.toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-[#F3E5AB]/50">Per 1 Gram</p>
                  </div>
                </div>

                {/* Silver Kg Row */}
                <div className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">Silver Bar (1 Kilogram)</span>
                    <p className="text-xs text-[#F3E5AB]/60">Investment bulk silver</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                      ₹{(latestRate.silver_1g * 1000).toLocaleString("en-IN")}
                    </span>
                    <p className="text-[10px] text-[#F3E5AB]/50">Per 1 Kilogram</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust callout */}
            <div className="bg-[#1a0b2e]/30 border border-[#D4AF37]/10 rounded-xl p-5 flex items-start space-x-3 text-xs">
              <ShieldCheck className="h-6 w-6 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-white uppercase">No Hidden Rates</p>
                <p className="text-[#F3E5AB]/60 leading-relaxed mt-0.5">
                  The rates listed above represent the opening board rate in Tirupur, Tamil Nadu. Sri Velmayil Jewellery guarantees transparent pricing, with making charges and GST separately accounted for on all customer invoices.
                </p>
              </div>
            </div>
          </div>

          {/* Historical Trends Navigation (5 Columns) */}
          <div className="lg:col-span-5 bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB] mb-6 flex items-center">
              <History className="h-5.5 w-5.5 mr-2 text-[#D4AF37]" />
              Recent Fluctuations
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#D4AF37]/15 text-[#D4AF37] font-serif uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">22K / Gram</th>
                    <th className="pb-3 font-semibold text-right">Silver / g</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 font-sans">
                  {rateHistory.slice(0, 5).map((rate) => (
                    <tr key={rate.date} className="hover:bg-[#D4AF37]/5 transition-colors">
                      <td className="py-3">
                        <Link href={`/gold-rate/${rate.date}`} className="hover:text-[#D4AF37] hover:underline font-medium">
                          {formatIndianDate(rate.date)}
                        </Link>
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-white">
                        ₹{rate.gold22k_1g.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-right font-mono text-[#F3E5AB]/75">
                        ₹{rate.silver_1g.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D4AF37]/10 text-center">
              <Link
                href="/gold-rate-history"
                className="w-full inline-flex justify-center items-center py-2.5 px-4 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a0b2e] border border-[#D4AF37]/20 font-bold text-xs rounded-lg uppercase tracking-wider transition-all"
              >
                View Full Historical Rates
              </Link>
            </div>
          </div>
        </div>

        {/* Live Calculator section */}
        <div className="bg-[#090313] border border-[#D4AF37]/10 rounded-2xl p-4 sm:p-8 max-w-4xl mx-auto shadow-inner">
          <div className="text-center mb-8 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">Estimate Gold ornament Price</h2>
            <p className="text-xs text-[#F3E5AB]/60 font-sans mt-1">
              Select weight and custom making charges to see how today's rate affects total costs.
            </p>
          </div>
          <RateCalculator today22kRate={latestRate.gold22k_1g} />
        </div>
      </div>
    </>
  );
}
