import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import goldRatesData from "@/data/gold-rates.json";
import { formatIndianDate } from "@/utils/date";
import { getSeoMetadata } from "@/utils/seo";

export const metadata = getSeoMetadata({
  title: "Gold Rate History in Tirupur | Historical 22K Gold Prices",
  description: "Track gold and silver rate changes in Tirupur. Historical table of 22K gold prices per gram, 8 gram sovereigns, and silver rate movements in Tamil Nadu.",
  path: "/gold-rate-history"
});

export default function HistoryPage() {
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Today's Gold Rate", item: "https://srivelmayiljewellery.com/gold-rate-today-tirupur" },
    { name: "Gold Rate History", item: "https://srivelmayiljewellery.com/gold-rate-history" }
  ]);

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/gold-rate-today-tirupur"
            className="inline-flex items-center text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Today's Rate
          </Link>
        </div>

        {/* Title */}
        <div className="text-center md:text-left border-b border-[#D4AF37]/20 pb-8 mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Gold Rate History in Tirupur
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/75 font-sans leading-relaxed max-w-2xl">
              Track the historical movement of 22K gold and silver prices. Analysis of market fluctuations in Tirupur, Tamil Nadu.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-bold font-sans bg-[#D4AF37]/10 text-[#D4AF37] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20">
            <TrendingUp className="h-4 w-4" />
            <span>Updates Registered Daily</span>
          </div>
        </div>

        {/* CSS-based visual gold rate tracker chart (no heavy libraries) */}
        <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12 backdrop-blur-md">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-white mb-6 uppercase tracking-wider">
            22K Gold Price Trend Visualizer
          </h2>
          
          <div className="h-64 flex items-end justify-between gap-2 border-b border-[#D4AF37]/25 pb-4">
            {goldRatesData.slice(0, 7).reverse().map((rate, index) => {
              // Calculate relative height based on values (13500 to 14100 range)
              const minVal = 13400;
              const maxVal = 14200;
              const heightPct = ((rate.gold22k_1g - minVal) / (maxVal - minVal)) * 100;
              
              return (
                <div key={rate.date} className="flex-1 flex flex-col items-center group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#D4AF37] text-[#1a0b2e] text-[10px] font-bold py-1 px-2 rounded absolute mb-24 pointer-events-none shadow-md z-10 font-mono">
                    ₹{rate.gold22k_1g}/g
                  </div>
                  
                  {/* Visual Bar */}
                  <div 
                    style={{ height: `${Math.max(10, Math.min(100, heightPct))}%` }} 
                    className="w-full bg-gradient-to-t from-[#D4AF37]/40 to-[#F3E5AB] rounded-t-md hover:from-[#D4AF37] hover:to-white transition-all duration-300 relative group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  ></div>
                  
                  {/* Date label */}
                  <span className="text-[10px] text-[#F3E5AB]/60 mt-3 hidden sm:block whitespace-nowrap rotate-12 sm:rotate-0">
                    {rate.date.substring(5)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-[#F3E5AB]/40 mt-4 italic font-sans">
            <span>* Graph displays the price movement of 22K Gold per Gram over the last 7 recorded entries.</span>
            <span className="hidden md:inline">Hover over bars to check rates.</span>
          </div>
        </div>

        {/* Detailed History Table */}
        <div className="bg-[#1a0b2e]/30 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#D4AF37] font-serif uppercase tracking-widest text-xs">
                  <th className="pb-4">Date</th>
                  <th className="pb-4 text-right">22K Gold (1 Gram)</th>
                  <th className="pb-4 text-right">22K Gold (8g Sovereign)</th>
                  <th className="pb-4 text-right">Fine Silver (1g)</th>
                  <th className="pb-4 text-right">Trend / Gram</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10 font-sans">
                {goldRatesData.map((rate) => (
                  <tr key={rate.date} className="hover:bg-[#D4AF37]/5 transition-colors">
                    <td className="py-4">
                      <Link 
                        href={`/gold-rate/${rate.date}`} 
                        className="font-bold text-white hover:text-[#D4AF37] hover:underline"
                      >
                        {formatIndianDate(rate.date)}
                      </Link>
                    </td>
                    <td className="py-4 text-right font-mono text-white">
                      ₹{rate.gold22k_1g.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-right font-mono text-[#F3E5AB]/90">
                      ₹{rate.gold22k_8g.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-right font-mono text-[#F3E5AB]/75">
                      ₹{rate.silver_1g.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-right font-mono">
                      {rate.trend_gold !== 0 ? (
                        <span className={`inline-flex items-center text-xs font-bold ${
                          rate.trend_gold > 0 ? "text-red-400" : "text-emerald-400"
                        }`}>
                          {rate.trend_gold > 0 ? (
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
                        </span>
                      ) : (
                        <span className="text-[#F3E5AB]/50">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
