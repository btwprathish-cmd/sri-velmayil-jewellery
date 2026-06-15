"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Download, Share2, ArrowLeft, Smartphone,
  Sparkles, Loader2, Shuffle
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import { formatIndianDate } from "@/utils/date";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";
import PosterTemplate from "@/components/PosterTemplate";
import {
  POSTER_THEMES, pickNextTheme, type PosterTheme
} from "@/lib/poster-themes";
import { generateArtworkDataUrl } from "@/utils/poster-artwork-canvas";

interface RateData {
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  date: string;
  dateDisplay: string;
}

function toPosterDateLabel(date: string, dateDisplay: string): string {
  const d = date ? new Date(date) : new Date(dateDisplay.replace(/(\d+)(st|nd|rd|th)/i, "$1"));
  if (isNaN(d.getTime())) return dateDisplay.toUpperCase();
  const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function PosterStudio() {
  const [mounted, setMounted] = useState(false);
  const [rates, setRates] = useState<RateData | null>(null);
  const [manualRates, setManualRates] = useState({ gold1g: "", gold8g: "", silver1g: "" });
  const [useManual, setUseManual] = useState(false);
  const [theme, setTheme] = useState<PosterTheme | null>(null);
  const [lastThemeId, setLastThemeId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [artSource, setArtSource] = useState("");
  const posterRef = useRef<HTMLDivElement>(null);

  const effectiveRates = useCallback((): RateData | null => {
    if (!rates) return null;
    if (!useManual) return rates;
    return {
      ...rates,
      gold22k_1g: Number(manualRates.gold1g) || rates.gold22k_1g,
      gold22k_8g: Number(manualRates.gold8g) || rates.gold22k_8g,
      silver_1g: Number(manualRates.silver1g) || rates.silver_1g,
    };
  }, [rates, useManual, manualRates]);

  const fetchRates = useCallback(async () => {
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
    setManualRates({
      gold1g: String(rateData.gold22k_1g),
      gold8g: String(rateData.gold22k_8g),
      silver1g: String(rateData.silver_1g),
    });
    return rateData;
  }, []);

  const generatePoster = useCallback(async (themeOverride?: string) => {
    setGenerating(true);
    const seed = Date.now();
    const nextTheme = pickNextTheme(lastThemeId, themeOverride || selectedThemeId || undefined);
    setTheme(nextTheme);
    setLastThemeId(nextTheme.id);

    try {
      const res = await fetch("/api/poster/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId: nextTheme.id, seed }),
      });
      const data = await res.json();

      if (data.imageData) {
        setArtworkUrl(data.imageData);
        setArtSource(data.source || "ai");
      } else {
        const fallback = generateArtworkDataUrl(nextTheme, seed);
        setArtworkUrl(fallback);
        setArtSource("canvas-fallback");
      }
    } catch {
      const fallback = generateArtworkDataUrl(nextTheme, seed);
      setArtworkUrl(fallback);
      setArtSource("canvas-fallback");
    }

    setGenerating(false);
  }, [lastThemeId, selectedThemeId]);

  useEffect(() => {
    setMounted(true);
    fetchRates().then(() => generatePoster());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExport = async (type: "png" | "jpg") => {
    const node = posterRef.current?.querySelector("#poster-canvas") as HTMLElement | null;
    if (!node) return;

    const opts = { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true };
    const dataUrl = type === "png"
      ? await toPng(node, opts)
      : await toJpeg(node, { ...opts, quality: 0.95, backgroundColor: theme?.bg ?? "#6E1423" });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `sri-velmayil-gold-rate-${rates?.date || "today"}.${type}`;
    link.click();
  };

  const handleShareWhatsApp = () => {
    const r = effectiveRates();
    if (!r) return;
    const text = `${BRAND.name} ${BRAND.location} — Daily Rates\n\n22K Gold 1g: ₹${r.gold22k_1g.toLocaleString("en-IN")}\n22K Gold 8g: ₹${r.gold22k_8g.toLocaleString("en-IN")}\nSilver 1g: ₹${r.silver_1g.toLocaleString("en-IN")}\n\n${toPosterDateLabel(r.date, r.dateDisplay)}`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  const r = effectiveRates();

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
        <Link href="/gold-rate-today-tirupur" className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Gold Rate
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          AI Poster Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#F3E5AB]/75 mt-2 max-w-2xl mx-auto">
          Fixed brand template + AI jewellery artwork. Logo and contact info are never AI-generated.
          Export 1080×1920 for Instagram Story / WhatsApp Status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-4 bg-[#1a0b2e]/65 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2 uppercase tracking-wider">
            Rates
          </h2>

          <label className="flex items-center gap-2 text-xs text-[#F3E5AB]/70 cursor-pointer">
            <input type="checkbox" checked={useManual} onChange={(e) => setUseManual(e.target.checked)} className="accent-[#D4AF37]" />
            Manual rate override (admin)
          </label>

          {useManual ? (
            <div className="space-y-2 text-sm">
              <input type="number" placeholder="22K 1g" value={manualRates.gold1g} onChange={(e) => setManualRates((m) => ({ ...m, gold1g: e.target.value }))}
                className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white" />
              <input type="number" placeholder="22K 8g" value={manualRates.gold8g} onChange={(e) => setManualRates((m) => ({ ...m, gold8g: e.target.value }))}
                className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white" />
              <input type="number" placeholder="Silver 1g" value={manualRates.silver1g} onChange={(e) => setManualRates((m) => ({ ...m, silver1g: e.target.value }))}
                className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white" />
            </div>
          ) : r ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="flex justify-between"><span className="text-[#F3E5AB]/60">22K 1g</span><span className="text-[#D4AF37]">₹{r.gold22k_1g.toLocaleString("en-IN")}</span></p>
              <p className="flex justify-between"><span className="text-[#F3E5AB]/60">22K 8g</span><span className="text-[#D4AF37]">₹{r.gold22k_8g.toLocaleString("en-IN")}</span></p>
              <p className="flex justify-between"><span className="text-[#F3E5AB]/60">Silver 1g</span><span className="text-[#D4AF37]">₹{r.silver_1g.toLocaleString("en-IN")}</span></p>
              <p className="text-[#F3E5AB]/50 text-xs pt-1">Live from /api/rates</p>
            </div>
          ) : (
            <Loader2 className="h-5 w-5 text-[#D4AF37] animate-spin mx-auto" />
          )}

          <div>
            <label className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider">Theme</label>
            <select
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
              className="w-full mt-1 bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Random (no repeat)</option>
              {POSTER_THEMES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {theme && (
            <p className="text-[10px] text-[#F3E5AB]/50">
              Active: <span className="text-[#D4AF37]">{theme.name}</span>
              {artSource && <> · Art: {artSource}</>}
            </p>
          )}

          <button
            onClick={() => generatePoster()}
            disabled={generating}
            className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-xs disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Generate Poster
          </button>

          <button
            onClick={() => { setSelectedThemeId(""); generatePoster(); }}
            disabled={generating}
            className="w-full flex items-center justify-center py-2 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold rounded-lg uppercase"
          >
            <Shuffle className="h-3.5 w-3.5 mr-1.5" /> Shuffle Theme
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleExport("png")} disabled={!artworkUrl || generating}
              className="flex items-center justify-center py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold rounded-lg disabled:opacity-40">
              <Download className="h-4 w-4 mr-1" /> PNG
            </button>
            <button onClick={() => handleExport("jpg")} disabled={!artworkUrl || generating}
              className="flex items-center justify-center py-2.5 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold rounded-lg disabled:opacity-40">
              <Download className="h-4 w-4 mr-1" /> JPG
            </button>
          </div>

          <button onClick={handleShareWhatsApp}
            className="w-full flex items-center justify-center py-2 rounded bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-xs font-bold">
            <Share2 className="h-3.5 w-3.5 mr-1" /> Share Rates on WhatsApp
          </button>

          <div className="flex items-center gap-2 text-[10px] text-[#F3E5AB]/40">
            <Smartphone className="h-3.5 w-3.5" />
            <span>1080×1920 · Logo &amp; text are fixed HTML overlays</span>
          </div>
        </div>

        {/* Preview — scaled */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-3">
            Live Preview (1080×1920)
          </span>
          <div
            ref={posterRef}
            className="overflow-hidden rounded-2xl border border-[#D4AF37]/35 shadow-2xl origin-top"
            style={{ width: 270, height: 480 }}
          >
            <div style={{ transform: "scale(0.25)", transformOrigin: "top left", width: 1080, height: 1920 }}>
              {theme && r && artworkUrl && !generating ? (
                <PosterTemplate
                  theme={theme}
                  rates={{
                    gold22k_1g: r.gold22k_1g,
                    gold22k_8g: r.gold22k_8g,
                    silver_1g: r.silver_1g,
                    dateLabel: toPosterDateLabel(r.date, r.dateDisplay),
                  }}
                  artworkUrl={artworkUrl}
                />
              ) : (
                <div className="w-[1080px] h-[1920px] bg-[#6E1423] flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
