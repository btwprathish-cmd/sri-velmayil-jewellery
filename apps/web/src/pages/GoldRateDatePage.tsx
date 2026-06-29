import React, { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Clock, Calendar } from "lucide-react";
import { fetchRateByDate, type LiveRateRecord } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";

export default function GoldRateDatePage() {
  const [, params] = useRoute("/gold-rate/:date");
  const date = params?.date ?? "";
  const [rate, setRate] = useState<LiveRateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!date) return;
    fetchRateByDate(date)
      .then((r: LiveRateRecord | null) => { if (r) setRate(r); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) return <div className="py-32 text-center text-[#F3E5AB]/60">Loading...</div>;
  if (notFound || !rate) return (
    <div className="py-32 text-center">
      <p className="text-[#F3E5AB]/60 mb-4">Rate not found for this date.</p>
      <Link href="/gold-rate-history" className="text-[#D4AF37] hover:underline">← Back to History</Link>
    </div>
  );

  const formattedDate = formatIndianDate(date);
  const gold24k_1g = Math.round(rate.gold22k_1g / 0.916);
  const gold18k_1g = Math.round(rate.gold22k_1g * (18 / 22));

  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/gold-rate-history" className="inline-flex items-center text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rate History
        </Link>
      </div>

      <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-2 text-[#D4AF37] mb-4 text-xs font-bold uppercase tracking-widest">
          <Calendar className="h-4 w-4" />
          <span>Archive Pricing Index</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-2">
          Gold Rate on {formattedDate}
        </h1>
        <p className="text-xs text-[#F3E5AB]/60 font-sans mb-8">Recorded price in Tirupur, Tamil Nadu. Verified at Sri Velmayil Jewellery.</p>

        <div className="space-y-4 font-sans mb-8">
          {[
            { label: "22K Gold (916 Hallmarked)", sub: "Ornaments Rate", value: rate.gold22k_1g, unit: "Per 1 Gram" },
            { label: "22K Gold (Sovereign Board Rate)", sub: "8 Gram Sovereign", value: rate.gold22k_8g, unit: "Per 8 Grams" },
            { label: "24K Pure Gold (99.9%)", sub: "Bullion / Coin Rate", value: gold24k_1g, unit: "Per 1 Gram" },
            { label: "Fine Silver (99.9%)", sub: "Per Gram Price", value: rate.silver_1g, unit: "Per 1 Gram" },
          ].map(({ label, sub, value, unit }) => (
            <div key={label} className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
              <div>
                <span className="font-bold text-base text-white">{label}</span>
                <p className="text-[10px] text-[#F3E5AB]/50">{sub}</p>
              </div>
              <div className="text-right">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono">₹{value.toLocaleString("en-IN")}</span>
                <p className="text-[9px] text-[#F3E5AB]/50">{unit}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#D4AF37]/15 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[#F3E5AB]/50 font-sans gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#D4AF37] mr-1.5" />
            <span>Registered on: {rate.date}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Trend:</span>
            {(rate.trend_gold ?? 0) !== 0 ? (
              <span className={`inline-flex items-center font-bold ${(rate.trend_gold ?? 0) > 0 ? "text-red-400" : "text-emerald-400"}`}>
                {(rate.trend_gold ?? 0) > 0
                  ? <><ArrowUpRight className="h-3.5 w-3.5 mr-1" />+{rate.trend_gold}</>
                  : <><ArrowDownRight className="h-3.5 w-3.5 mr-1" />{rate.trend_gold}</>}
                {" "}(Gold/g)
              </span>
            ) : <span>Unchanged</span>}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center bg-[#1a0b2e]/30 border border-[#D4AF37]/10 p-6 rounded-2xl">
        <p className="text-xs text-[#F3E5AB]/65 font-sans mb-3">Looking for today's current live board rates?</p>
        <Link href="/gold-rate-today-tirupur"
          className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
        >
          Today's Gold Rate
        </Link>
      </div>
    </div>
  );
}
