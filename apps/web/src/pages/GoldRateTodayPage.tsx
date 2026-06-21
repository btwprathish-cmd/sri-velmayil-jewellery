import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, ShieldCheck, History } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  async function loadRates() {
    try {
      const [rate, history] = await Promise.all([
        fetchLatestRate(),
        fetchRateHistory()
      ]);

      setLatestRate(rate);
      setRateHistory(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadRates();

  const interval = setInterval(loadRates, 60000);

  return () => clearInterval(interval);
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

      <div className="max-w-4xl mx-auto space-y-6 mb-16">
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

    </div>
  );
}
