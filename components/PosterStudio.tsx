"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Download, Share2, RefreshCw, ArrowLeft, Smartphone,
  Sparkles, Check, Loader2
} from "lucide-react";
import { formatIndianDate } from "@/utils/date";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";
import {
  generatePosterConfig, generatePosterSvg, type PosterConfig
} from "@/utils/poster-engine";

interface RateData {
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  date: string;
  dateDisplay: string;
}

export default function PosterStudio() {
  const [mounted, setMounted] = useState(false);
  const [rates, setRates] = useState<RateData | null>(null);
  const [config, setConfig] = useState<PosterConfig | null>(null);
  const [svgContent, setSvgContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [format] = useState<"story" | "post">("story");
  const svgRef = useRef<HTMLDivElement>(null);

  const fetchRates = useCallback(async () => {
    const res = await fetch("/api/rates");
    const data = await res.json();
    setRates({
      gold22k_1g: data.gold22k_1g,
      gold22k_8g: data.gold22k_8g,
      silver_1g: data.silver_1g,
      date: data.date,
      dateDisplay: data.dateDisplay || formatIndianDate(data.date),
    });
  }, []);

  const generateNewPoster = useCallback(async (rateData?: RateData) => {
    const currentRates = rateData || rates;
    if (!currentRates) return;

    setGenerating(true);
    const newConfig = generatePosterConfig(undefined, format);
    const svg = generatePosterSvg(newConfig, {
      gold22k_1g: currentRates.gold22k_1g,
      gold22k_8g: currentRates.gold22k_8g,
      silver_1g: currentRates.silver_1g,
      dateDisplay: currentRates.dateDisplay,
    });

    setConfig(newConfig);
    setSvgContent(svg);
    setGenerating(false);
  }, [rates, format]);

  useEffect(() => {
    setMounted(true);
    fetchRates().then(async () => {
      const res = await fetch("/api/rates");
      const data = await res.json();
      const rateData: RateData = {
        gold22k_1g: data.gold22k_1g,
        gold22k_8g: data.gold22k_8g,
        silver_1g: data.silver_1g,
        date: data.date,
        dateDisplay: data.dateDisplay || formatIndianDate(data.date),
      };
      setRates(rateData);
      generateNewPoster(rateData);
    });
  }, [fetchRates, generateNewPoster]);

  const targetDims = format === "story"
    ? { width: 1080, height: 1920 }
    : { width: 1080, height: 1080 };

  const previewDims = format === "story"
    ? { width: 270, height: 480 }
    : { width: 380, height: 380 };

  const handleExport = async (fileType: "png" | "jpg") => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (fileType === "jpg") {
        ctx.fillStyle = "#0c0418";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL(fileType === "jpg" ? "image/jpeg" : "image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `sri-velmayil-gold-rate-${rates?.date || "today"}-story.${fileType}`;
      link.click();
      URL.revokeObjectURL(url);
    };

    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  };

  const handleShareWhatsApp = () => {
    if (!rates) return;
    const text = `${BRAND.name} ${BRAND.location} — Daily Rates\n\n22K Gold 1g: ₹${rates.gold22k_1g.toLocaleString("en-IN")}\n22K Gold 8g: ₹${rates.gold22k_8g.toLocaleString("en-IN")}\nSilver 1g: ₹${rates.silver_1g.toLocaleString("en-IN")}\n\nDate: ${rates.dateDisplay}\nhttps://srivelmayiljewellery.com/gold-rate-today-tirupur`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  const handleCopyRates = () => {
    if (!rates) return;
    const text = `${BRAND.name} Rates — ${rates.dateDisplay}\nGold 22K 1g: ₹${rates.gold22k_1g}\nGold 22K 8g: ₹${rates.gold22k_8g}\nSilver 1g: ₹${rates.silver_1g}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0c0418] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/gold-rate-today-tirupur"
          className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Gold Rate
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          AI Poster Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#F3E5AB]/75 mt-2 font-sans max-w-2xl mx-auto">
          Automatically generates a unique luxury jewellery poster with live gold &amp; silver rates.
          Ready for WhatsApp Status, Instagram Story, and Facebook Story (1080×1920).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Control Panel */}
        <div className="lg:col-span-4 bg-[#1a0b2e]/65 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-5 shadow-xl">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2 uppercase tracking-wider">
            Live Rates (Auto)
          </h2>

          {rates ? (
            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between bg-[#0c0418]/60 p-3 rounded-lg border border-[#D4AF37]/10">
                <span className="text-[#F3E5AB]/70">22K Gold (1g)</span>
                <span className="font-mono font-bold text-[#D4AF37]">₹{rates.gold22k_1g.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between bg-[#0c0418]/60 p-3 rounded-lg border border-[#D4AF37]/10">
                <span className="text-[#F3E5AB]/70">22K Gold (8g)</span>
                <span className="font-mono font-bold text-[#D4AF37]">₹{rates.gold22k_8g.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between bg-[#0c0418]/60 p-3 rounded-lg border border-[#D4AF37]/10">
                <span className="text-[#F3E5AB]/70">Silver (1g)</span>
                <span className="font-mono font-bold text-[#D4AF37]">₹{rates.silver_1g.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between bg-[#0c0418]/60 p-3 rounded-lg border border-[#D4AF37]/10">
                <span className="text-[#F3E5AB]/70">Date</span>
                <span className="font-bold text-white">{rates.dateDisplay}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin" />
            </div>
          )}

          {config && (
            <div className="text-[10px] text-[#F3E5AB]/50 space-y-1 border-t border-[#D4AF37]/10 pt-3">
              <p>Layout: <span className="text-[#D4AF37] capitalize">{config.layout.replace(/-/g, " ")}</span></p>
              <p>Palette: <span className="text-[#D4AF37] capitalize">{config.palette.name.replace(/-/g, " ")}</span></p>
              <p>Pattern: <span className="text-[#D4AF37] capitalize">{config.pattern.replace(/-/g, " ")}</span></p>
              <p>Jewelry: <span className="text-[#D4AF37] capitalize">{config.jewelryType}</span> (AI procedural)</p>
              <p>Typography: <span className="text-[#D4AF37]">{config.typography.heading.split(",")[0]}</span></p>
              <p>Seed: <span className="text-[#D4AF37] font-mono">{config.seed}</span></p>
            </div>
          )}

          <button
            onClick={() => generateNewPoster()}
            disabled={generating || !rates}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-xs hover:brightness-110 transition-all disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate New Unique Poster
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport("png")}
              disabled={!svgContent}
              className="flex items-center justify-center py-2.5 bg-[#1a0b2e] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold rounded-lg uppercase disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-1.5" /> PNG
            </button>
            <button
              onClick={() => handleExport("jpg")}
              disabled={!svgContent}
              className="flex items-center justify-center py-2.5 bg-[#1a0b2e] border border-[#D4AF37] text-[#D4AF37] text-xs font-bold rounded-lg uppercase disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-1.5" /> JPEG
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D4AF37]/10">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center py-2 rounded bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-600/30 text-emerald-400 text-xs font-bold transition-colors"
            >
              <Share2 className="h-3.5 w-3.5 mr-1" /> WhatsApp
            </button>
            <button
              onClick={handleCopyRates}
              className="flex items-center justify-center py-2 rounded bg-purple-600/20 hover:bg-purple-600/35 border border-purple-600/30 text-purple-400 text-xs font-bold transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : null}
              {copied ? "Copied" : "Copy Rates"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#F3E5AB]/40 pt-2">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Format: Instagram Story / WhatsApp Status (9:16)</span>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-3 font-sans">
            Live Preview ({targetDims.width}×{targetDims.height})
          </span>

          <div
            style={{ width: previewDims.width, height: previewDims.height }}
            className="bg-[#0c0418] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl"
          >
            {generating ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
              </div>
            ) : (
              <div
                ref={svgRef}
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>

          <p className="text-[10px] text-[#F3E5AB]/40 italic mt-4 text-center max-w-md">
            Each generation creates a unique layout, color palette, background pattern, and jewellery visual.
            Brand details ({BRAND.name}, {BRAND.phone}, {BRAND.address}) are always included.
          </p>
        </div>
      </div>
    </div>
  );
}
