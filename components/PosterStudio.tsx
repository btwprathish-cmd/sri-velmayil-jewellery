"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, RefreshCw, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { BRAND } from "@/utils/brand";
import { PosterFormData } from "@/utils/build-poster-prompt";



export default function PosterStudio() {
  const [rates, setRates] = useState<{
    gold22k_1g: string;
    gold22k_8g: string;
    silver_1g: string;
    fetchedAt: string;
    source: string;
  } | null>(null);

  const [formData, setFormData] = useState<PosterFormData>({
    companyName: process.env.NEXT_PUBLIC_ADMIN_COMPANY_NAME || BRAND.name,
    phone: process.env.NEXT_PUBLIC_ADMIN_PHONE || BRAND.phone,
    address: process.env.NEXT_PUBLIC_ADMIN_ADDRESS || BRAND.address,
    date: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    gold1g: '',
    gold8g: '',
    silver1g: '',
  });

  const [customLogo, setCustomLogo] = useState<string | null>(BRAND.logo);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateCount, setGenerateCount] = useState(0);

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const fetchLiveRates = async () => {
    setIsFetchingRates(true);
    setRatesError(null);
    try {
      const res = await fetch('/api/rates');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch rates');
      }
      const data = await res.json();
      setRates(data);
      setFormData(prev => ({
        ...prev,
        gold1g: data.gold22k_1g.toString(),
        gold8g: data.gold22k_8g.toString(),
        silver1g: data.silver_1g.toString(),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setRatesError('Could not fetch live rates. Enter manually or try again. (' + message + ')');
    } finally {
      setIsFetchingRates(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/admin/generate-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }
      const data = await res.json();
      
      if (!data.imageUrl) {
        throw new Error("No image generated.");
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Load the generated image
        const generatedImg = new Image();
        generatedImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          generatedImg.onload = resolve;
          generatedImg.onerror = reject;
          generatedImg.src = data.imageUrl;
        });

        ctx.drawImage(generatedImg, 0, 0, 1080, 1920);
        
        if (customLogo) {
          try {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
              logoImg.onload = resolve;
              logoImg.onerror = reject;
              logoImg.src = customLogo;
            });
            
            const maxWidth = 500;
            const maxHeight = 300;
            let width = logoImg.width;
            let height = logoImg.height;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = width * ratio;
              height = height * ratio;
            }

            const x = (1080 - width) / 2;
            const y = 80;

            ctx.drawImage(logoImg, x, y, width, height);
          } catch (e) {
            console.error("Failed to composite logo", e);
          }
        }
        setGeneratedPoster(canvas.toDataURL("image/jpeg", 0.9));
      } else {
        setGeneratedPoster(data.imageUrl);
      }
      
      setGenerateCount(prev => prev + 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setGenerateError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedPoster) return;
    try {
      if (generatedPoster.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = generatedPoster;
        link.download = `gold-rate-${formData.date.replace(/\s/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      
      const res = await fetch(
        `/api/admin/download-poster?url=${encodeURIComponent(generatedPoster)}`
      );
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `gold-rate-${formData.date.replace(/\s/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      alert('Download failed. Right-click the poster and save manually.');
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Dashboard
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
        {/* LEFT COLUMN — Form panel */}
        <div className="lg:col-span-4 bg-[#1a0b2e]/65 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-6 shadow-xl">
          
          {/* Section 1: Brand Details */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2 uppercase tracking-wider">
              Brand Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">Brand Logo</label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  {customLogo && (
                    <img src={customLogo} alt="Logo" className="h-10 w-auto bg-[#0c0418] border border-[#D4AF37]/30 rounded p-1 object-contain" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full text-xs text-[#F3E5AB]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/30 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#F3E5AB] text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#F3E5AB] text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#F3E5AB] text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Live Gold Rates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2">
              <h2 className="font-serif text-lg font-bold text-[#D4AF37] uppercase tracking-wider">
                Live Gold Rates
              </h2>
            </div>

            {rates && (
              <p className="text-[10px] text-[#F3E5AB]/50 italic">
                Fetched at {formatTime(rates.fetchedAt)} via {rates.source}
              </p>
            )}
            
            {ratesError && (
              <p className="text-xs text-red-400 mt-1">{ratesError}</p>
            )}

            <button
              onClick={fetchLiveRates}
              disabled={isFetchingRates}
              className="w-full flex items-center justify-center py-2 bg-[#1a0b2e] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold rounded-lg uppercase transition-all disabled:opacity-50"
            >
              {isFetchingRates ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Fetching...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> ↻ Refresh Rates
                </>
              )}
            </button>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">22K Gold 1GM (₹)</label>
                <input
                  type="text"
                  value={formData.gold1g}
                  onChange={(e) => setFormData({ ...formData, gold1g: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#D4AF37] font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">22K Gold 8GM (₹)</label>
                <input
                  type="text"
                  value={formData.gold8g}
                  onChange={(e) => setFormData({ ...formData, gold8g: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#D4AF37] font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/70 mb-1">Silver 1GM (₹)</label>
                <input
                  type="text"
                  value={formData.silver1g}
                  onChange={(e) => setFormData({ ...formData, silver1g: e.target.value })}
                  className="w-full bg-[#0c0418]/60 border border-[#D4AF37]/10 rounded-lg p-2.5 text-[#D4AF37] font-mono font-bold text-sm focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <p className="text-[10px] text-[#F3E5AB]/40 mt-2">
              Rates are pre-filled from live data. You may edit before generating.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-[#D4AF37]/15">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-xs hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> ✦ Generate Post
                </>
              )}
            </button>

            {generateError && (
              <p className="text-xs text-red-400 mt-3 text-center">{generateError}</p>
            )}

            {generateCount > 0 && (
              <p className="text-[10px] text-emerald-400 mt-3 text-center font-bold">
                ✓ {generateCount} poster(s) generated this session
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Preview panel */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-3 font-sans">
            Live Preview (1080×1920)
          </span>

          <div className="bg-[#0c0418] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] w-full max-w-[400px]">
            <PosterPreview imageUrl={generatedPoster} isGenerating={isGenerating} />
          </div>

          {generatedPoster && (
            <div className="mt-6 w-full max-w-[400px]">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center py-3 bg-[#1a0b2e] border border-[#D4AF37] text-[#D4AF37] text-sm font-bold rounded-lg uppercase disabled:opacity-50 hover:bg-[#D4AF37]/10 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" /> ⬇ Download PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PosterPreview = React.memo(({
  imageUrl,
  isGenerating,
}: {
  imageUrl: string | null;
  isGenerating: boolean;
}) => {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
        <p className="text-yellow-400 text-sm font-medium">Generating your poster...</p>
        <p className="text-gray-500 text-xs">This takes 15–20 seconds</p>
      </div>
    );
  }
  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-gray-600">
        <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
          <span className="text-3xl">🖼️</span>
        </div>
        <p className="text-sm text-gray-500">Click Generate Post to create your poster</p>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt="Generated gold rate poster"
      className="w-full h-full object-contain rounded-lg"
    />
  );
});

PosterPreview.displayName = 'PosterPreview';
