import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, History } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import RateCalculator from "@/components/RateCalculator";
import { fetchLatestRate, fetchRateHistory, getDerivedRates, type LiveRateRecord } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";

const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860, gold22k_8g: 110880, silver_1g: 270, gold24k_1g: 15131,
  source: "fallback", fetchedAt: new Date().toISOString(),
};

export default function GoldRateTodayPage() {
  const [latestRate, setLatestRate] = useState<LiveRateRecord>(FALLBACK_RATE);
  const [rateHistory, setRateHistory] = useState<LiveRateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLatestRate(), fetchRateHistory()])
      .then(([rate, history]) => { setLatestRate(rate); setRateHistory(history); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formattedDate = formatIndianDate(latestRate.date);
  const derived = getDerivedRates(latestRate);

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Gold Rate Today", href: "/gold-rate-today-tirupur" }]} />
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          Today's Gold Rate in Tirupur
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/75 max-w-xl mx-auto font-sans">
          {loading ? "Loading rates..." : `Live updates for ${formattedDate}. Rates verified at Sri Velmayil Jewellery.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#D4AF37]/10 pb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Board Rates Summary</h2>
              {(latestRate.trend_gold ?? 0) !== 0 && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  (latestRate.trend_gold ?? 0) > 0
                    ? "bg-red-500/10 text-red-400 border border-red-500/25"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                }`}>
                  {(latestRate.trend_gold ?? 0) > 0 ? (
                    <><ArrowUpRight className="h-3.5 w-3.5 mr-1" />Increased by ₹{Math.abs(latestRate.trend_gold ?? 0)}/g</>
                  ) : (
                    <><ArrowDownRight className="h-3.5 w-3.5 mr-1" />Decreased by ₹{Math.abs(latestRate.trend_gold ?? 0)}/g</>
                  )}
                </span>
              )}
            </div>
            <div className="space-y-4 font-sans">
              {[
                { label: "22K Gold (916 Hallmarked)", sub: "Standard ornament rate", value: latestRate.gold22k_1g, unit: "Per 1 Gram" },
                { label: "24K Pure Gold", sub: "Coins and bullion bars (99.9%)", value: derived.gold24k_1g, unit: "Per 1 Gram" },
                { label: "18K Studded Gold", sub: "Ideal for stone & diamond settings", value: derived.gold18k_1g, unit: "Per 1 Gram" },
                { label: "Silver (1 Gram)", sub: "Fine silver articles (99.9%)", value: latestRate.silver_1g, unit: "Per 1 Gram" },
                { label: "Silver Bar (1 Kilogram)", sub: "Investment bulk silver", value: latestRate.silver_1g * 1000, unit: "Per 1 Kilogram" },
              ].map(({ label, sub, value, unit }) => (
                <div key={label} className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                  <div>
                    <span className="font-bold text-lg text-white">{label}</span>
                    <p className="text-xs text-[#F3E5AB]/60">{sub}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">₹{Math.round(value).toLocaleString("en-IN")}</span>
                    <p className="text-[10px] text-[#F3E5AB]/50">{unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

        <div className="lg:col-span-5 bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB] mb-6 flex items-center">
            <History className="h-5 w-5 mr-2 text-[#D4AF37]" />
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
                    <td className="py-3 text-right font-mono font-semibold text-white">₹{rate.gold22k_1g.toLocaleString("en-IN")}</td>
                    <td className="py-3 text-right font-mono text-[#F3E5AB]/75">₹{rate.silver_1g.toLocaleString("en-IN")}</td>
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

      <div className="bg-[#090313] border border-[#D4AF37]/10 rounded-2xl p-4 sm:p-8 max-w-4xl mx-auto shadow-inner">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5AB]">Estimate Gold Ornament Price</h2>
          <p className="text-xs text-[#F3E5AB]/60 font-sans mt-1">Select weight and making charges to see costs.</p>
        </div>
        <RateCalculator today22kRate={latestRate.gold22k_1g} />
      </div>
    </div>
  );
}
