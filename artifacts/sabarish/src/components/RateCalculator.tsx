import React, { useState, useEffect } from "react";
import { Calculator, HelpCircle } from "lucide-react";

interface RateCalculatorProps {
  today22kRate: number;
}

export default function RateCalculator({ today22kRate }: RateCalculatorProps) {
  const [weight, setWeight] = useState<number>(10);
  const [purity, setPurity] = useState<string>("22K");
  const [makingCharges, setMakingCharges] = useState<number>(10);
  const [customRate, setCustomRate] = useState<number>(today22kRate);

  const getRatePerGram = () => {
    if (purity === "24K") return Math.round(customRate / 0.916);
    if (purity === "18K") return Math.round(customRate * (18 / 22));
    return customRate;
  };

  const currentRate = getRatePerGram();
  const goldValue = currentRate * weight;
  const makingChargesValue = goldValue * (makingCharges / 100);
  const taxableValue = goldValue + makingChargesValue;
  const gstValue = taxableValue * 0.03;
  const totalEstimatedPrice = taxableValue + gstValue;

  useEffect(() => {
    setCustomRate(today22kRate);
  }, [today22kRate]);

  return (
    <div className="bg-gradient-to-br from-[#25103f] to-[#120522] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full"></div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
          <Calculator className="h-6 w-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Live Gold Value Calculator
          </h3>
          <p className="text-xs text-[#F3E5AB]/60">Estimate your gold ornament price with GST</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-widest mb-2">
              Today's 22K Gold Rate (₹/Gram)
            </label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-widest mb-2">Purity (Carat)</label>
            <div className="grid grid-cols-3 gap-2">
              {["24K", "22K", "18K"].map((carat) => (
                <button
                  key={carat}
                  type="button"
                  onClick={() => setPurity(carat)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    purity === carat
                      ? "bg-[#D4AF37] text-[#1a0b2e] shadow-md"
                      : "bg-[#1a0b2e] text-[#F3E5AB]/70 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30"
                  }`}
                >
                  {carat} ({carat === "24K" ? "99.9%" : carat === "22K" ? "91.6%" : "75.0%"})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-widest mb-2">Weight (Grams)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0.1"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
              />
              <div className="flex bg-[#1a0b2e] border border-[#D4AF37]/10 rounded-lg overflow-hidden">
                {[8, 16, 32].map((gm) => (
                  <button
                    key={gm}
                    type="button"
                    onClick={() => setWeight(gm)}
                    className="px-3 text-xs font-bold text-[#D4AF37] border-l border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    {gm}g
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-widest mb-2">
              <span>Making & Wastage Charges</span>
              <span className="text-[#D4AF37]">{makingCharges}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={makingCharges}
              onChange={(e) => setMakingCharges(Number(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
            <div className="flex justify-between text-[10px] text-[#F3E5AB]/40 mt-1">
              <span>0% (Bars/Coins)</span>
              <span>10% (Avg)</span>
              <span>25% (Heavy)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/15 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#D4AF37]/10 pb-2">Price Breakdown</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#F3E5AB]/70">
                <span>Gold Rate ({purity})</span>
                <span className="font-mono">₹{currentRate.toLocaleString("en-IN")}/g</span>
              </div>
              <div className="flex justify-between text-[#F3E5AB]/70">
                <span>Gold Value ({weight}g)</span>
                <span className="font-mono">₹{Math.round(goldValue).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#F3E5AB]/70">
                <span>Making Charges ({makingCharges}%)</span>
                <span className="font-mono">₹{Math.round(makingChargesValue).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#F3E5AB]/70 border-t border-[#D4AF37]/10 pt-2 font-semibold">
                <span>Taxable Value</span>
                <span className="font-mono">₹{Math.round(taxableValue).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#F3E5AB]/70">
                <span>GST (3%)</span>
                <span className="font-mono">₹{Math.round(gstValue).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4AF37]/25 pt-4 mt-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Estimated Total</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37] font-mono">
                ₹{Math.round(totalEstimatedPrice).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-[#F3E5AB]/40 leading-relaxed italic flex items-start">
              <HelpCircle className="h-3.5 w-3.5 text-[#D4AF37]/60 mr-1 flex-shrink-0 mt-0.5" />
              This is an estimate. Exact rates and making charges may vary by product design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
