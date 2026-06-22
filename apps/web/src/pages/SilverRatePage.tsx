import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fetchLatestRate, getDerivedRates, type LiveRateRecord } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";
import { BRAND } from "@/utils/brand";

const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860, gold22k_8g: 110880, silver_1g: 270, gold24k_1g: 15131,
  source: "fallback", fetchedAt: new Date().toISOString(),
};

export default function SilverRatePage() {
  const [latestRate, setLatestRate] = useState<LiveRateRecord>(FALLBACK_RATE);
  useEffect(() => { fetchLatestRate().then(setLatestRate).catch(() => {}); }, []);
  const derived = getDerivedRates(latestRate);
  const formattedDate = formatIndianDate(latestRate.date);

  return (
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
          <p className="font-serif text-5xl font-bold text-[#D4AF37] font-mono">₹{latestRate.silver_1g.toLocaleString("en-IN")}</p>
          <p className="text-sm text-[#F3E5AB]/70 mt-2">Per 1 Gram</p>
        </div>
        <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-8 text-center shadow-2xl">
          <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider mb-2">Silver Bar</p>
          <p className="font-serif text-5xl font-bold text-[#D4AF37] font-mono">₹{derived.silver_1kg.toLocaleString("en-IN")}</p>
          <p className="text-sm text-[#F3E5AB]/70 mt-2">Per 1 Kilogram</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/gold-rate-today-tirupur"
          className="inline-flex items-center px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-all text-sm"
        >
          View Gold Rate Today
        </Link>
      </div>
    </div>
  );
}
