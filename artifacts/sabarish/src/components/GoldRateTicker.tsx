import React from "react";
import { type LiveRateRecord } from "@/utils/rates";

interface GoldRateTickerProps {
  rate: LiveRateRecord | null;
  loading?: boolean;
  error?: boolean;
}

export default function GoldRateTicker({ rate, loading, error }: GoldRateTickerProps) {
  let content: string;

  if (loading || !rate) {
    content = "✦ Fetching live rates...";
  } else if (error) {
    content = "✦ Live rates unavailable — please call us";
  } else {
    const segment = `✦ 22K Gold: ₹${rate.gold22k_1g.toLocaleString("en-IN")}/gm  |  24K Gold: ₹${rate.gold24k_1g.toLocaleString("en-IN")}/gm  |  Silver: ₹${rate.silver_1g.toLocaleString("en-IN")}/gm`;
    content = `${segment}  ${segment}  ${segment}`;
  }

  return (
    <div
      className="w-full overflow-hidden bg-[#0c0418] border-b border-[#D4AF37]/30"
      style={{ height: "36px" }}
    >
      <div
        key={content}
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: loading || error ? "none" : "ticker-scroll 32s linear infinite",
          willChange: "transform",
        }}
      >
        <span className="text-[#D4AF37] text-xs font-semibold tracking-wider px-8 font-sans">
          {content}
        </span>
        {!loading && !error && rate && (
          <span className="text-[#D4AF37] text-xs font-semibold tracking-wider px-8 font-sans" aria-hidden>
            {`✦ 22K Gold: ₹${rate.gold22k_1g.toLocaleString("en-IN")}/gm  |  24K Gold: ₹${rate.gold24k_1g.toLocaleString("en-IN")}/gm  |  Silver: ₹${rate.silver_1g.toLocaleString("en-IN")}/gm`}
          </span>
        )}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
