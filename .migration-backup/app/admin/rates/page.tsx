"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, TrendingUp, Loader2 } from "lucide-react";
import { formatIndianDate } from "@/utils/date";

interface LiveRate {
  date: string;
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  gold24k_1g: number;
  source: string;
  fetchedAt: string;
  dateDisplay?: string;
}

export default function AdminRatesPage() {
  const [rate, setRate] = useState<LiveRate | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/rates");
    const data = await res.json();
    setRate(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0418] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider mb-6">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Live Market Rates
          </h1>
          <button onClick={fetchRates} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-xs font-bold hover:bg-[#D4AF37]/10">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-sm text-amber-200">
          Rates are fetched automatically from live market APIs. Manual editing is disabled for production accuracy.
        </div>

        {loading || !rate ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-bold">
              <TrendingUp className="h-4 w-4" />
              Source: {rate.source}
            </div>
            <p className="text-xs text-[#F3E5AB]/60">
              Last fetched: {new Date(rate.fetchedAt).toLocaleString("en-IN")} • Date: {rate.dateDisplay || formatIndianDate(rate.date)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                <p className="text-xs text-[#F3E5AB]/60">22K Gold (1g)</p>
                <p className="text-2xl font-bold text-[#D4AF37] font-mono">₹{rate.gold22k_1g.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                <p className="text-xs text-[#F3E5AB]/60">22K Gold (8g)</p>
                <p className="text-2xl font-bold text-[#D4AF37] font-mono">₹{rate.gold22k_8g.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                <p className="text-xs text-[#F3E5AB]/60">24K Gold (1g)</p>
                <p className="text-2xl font-bold text-white font-mono">₹{rate.gold24k_1g.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                <p className="text-xs text-[#F3E5AB]/60">Silver (1g)</p>
                <p className="text-2xl font-bold text-white font-mono">₹{rate.silver_1g.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
