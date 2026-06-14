"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Download, Share2, Calendar, Phone, MapPin, 
  RefreshCw, Save, Trash2, Search, ArrowLeft,
  Smartphone, Square, Layout, Landmark, Check
} from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import goldRatesData from "@/data/gold-rates.json";
import { formatIndianDate, getTodayDateString } from "@/utils/date";

interface PosterRecord {
  id: string;
  date: string;
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  trend_gold: number;
  templateId: string;
  format: "story" | "post" | "facebook";
  message: string;
}

export default function PosterGeneratorPage() {
  const [mounted, setMounted] = useState(false);

  // Core rate states
  const [gold1g, setGold1g] = useState<number>(0);
  const [gold8g, setGold8g] = useState<number>(0);
  const [silver1g, setSilver1g] = useState<number>(0);
  const [trendGold, setTrendGold] = useState<number>(0);
  const [dateStr, setDateStr] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Editor states
  const [templateId, setTemplateId] = useState<string>("peacock");
  const [format, setFormat] = useState<"story" | "post" | "facebook">("post");
  const [jewelryType, setJewelryType] = useState<string>("necklace");

  // History & search states
  const [history, setHistory] = useState<PosterRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);

  // Load initial daily rates from JSON and history from localStorage
  useEffect(() => {
    setMounted(true);
    const latest = goldRatesData[0];
    setGold1g(latest.gold22k_1g);
    setGold8g(latest.gold22k_8g);
    setSilver1g(latest.silver_1g);
    setTrendGold(latest.trend_gold);
    setDateStr(getTodayDateString());
    setMessage(latest.message);

    // Load history
    const saved = localStorage.getItem("velmayil_posters_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0c0418] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-[#D4AF37] animate-spin" />
          <p className="text-sm text-[#F3E5AB]/60 font-sans">Loading Poster Studio...</p>
        </div>
      </div>
    );
  }

  // Get formatted date string for poster
  const displayDateStr = formatIndianDate(dateStr);

  // SVG dimensions for preview mapping
  const getPreviewDimensions = () => {
    if (format === "story") {
      return { width: 315, height: 560 }; // 9:16 scaled down
    } else if (format === "facebook") {
      return { width: 480, height: 252 }; // 1.91:1 scaled down
    }
    return { width: 380, height: 380 }; // 1:1 scaled down
  };

  const getTargetDimensions = () => {
    if (format === "story") {
      return { width: 1080, height: 1920 };
    } else if (format === "facebook") {
      return { width: 1200, height: 630 };
    }
    return { width: 1080, height: 1080 };
  };

  const dims = getPreviewDimensions();
  const targetDims = getTargetDimensions();

  // Export SVG to PNG or JPEG using HTML5 Canvas
  const handleExport = (fileType: "png" | "jpg") => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const context = canvas.getContext("2d");
      
      if (!context) return;

      if (fileType === "jpg") {
        // Fill canvas with theme bg color for JPG (which doesn't support transparency)
        context.fillStyle = templateId === "emerald" ? "#020e0c" : templateId === "crimson" ? "#120105" : "#0c0418";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);
      
      const dataUrl = canvas.toDataURL(fileType === "jpg" ? "image/jpeg" : "image/png", 1.0);
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `sri-velmayil-gold-rate-${dateStr}-${format}.${fileType}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);
    };
    image.src = blobURL;
  };

  // Save current poster configuration to history
  const handleSaveToHistory = () => {
    const newRecord: PosterRecord = {
      id: Date.now().toString(),
      date: dateStr,
      gold22k_1g: gold1g,
      gold22k_8g: gold8g,
      silver_1g: silver1g,
      trend_gold: trendGold,
      templateId,
      format,
      message
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem("velmayil_posters_history", JSON.stringify(updated));
  };

  // Delete history item
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    localStorage.setItem("velmayil_posters_history", JSON.stringify(updated));
  };

  // Reload history item into editor
  const handleLoadHistory = (record: PosterRecord) => {
    setDateStr(record.date);
    setGold1g(record.gold22k_1g);
    setGold8g(record.gold22k_8g);
    setSilver1g(record.silver_1g);
    setTrendGold(record.trend_gold);
    setTemplateId(record.templateId);
    setFormat(record.format);
    setMessage(record.message);
  };

  // Filter history records by date query
  const filteredHistory = history.filter(r => r.date.includes(searchQuery));

  // Copy Link share helper
  const handleCopyLink = () => {
    const shareText = `Sri Velmayil Jewellery Daily Gold Rate: 22K 1g = ₹${gold1g}, 8g = ₹${gold8g}, Silver 1g = ₹${silver1g}. Visit: https://srivelmayiljewellery.com/gold-rate-today-tirupur`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share link generators
  const getShareUrl = (platform: "whatsapp" | "facebook" | "telegram") => {
    const text = `Sri Velmayil Jewellery Tirupur Daily Rate:\nGold 22K 1g: ₹${gold1g}\nGold 22K 8g: ₹${gold8g}\nSilver 1g: ₹${silver1g}\nCheck Live: https://srivelmayiljewellery.com/gold-rate-today-tirupur`;
    if (platform === "whatsapp") {
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    } else if (platform === "telegram") {
      return `https://t.me/share/url?url=https://srivelmayiljewellery.com/gold-rate-today-tirupur&text=${encodeURIComponent(text)}`;
    } else {
      return `https://www.facebook.com/sharer/sharer.php?u=https://srivelmayiljewellery.com/gold-rate-today-tirupur`;
    }
  };

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Poster Studio", item: "https://srivelmayiljewellery.com/poster-generator" }
  ]);

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/gold-rate-today-tirupur"
            className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* Banner Title */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Daily Gold Rate Poster Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#F3E5AB]/75 mt-2 font-sans">
            Generate, customize, download, and share high-resolution marketing banners for WhatsApp and Instagram.
          </p>
        </div>

        {/* Dashboard Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Control Panel (Left 4 Columns) */}
          <div className="lg:col-span-4 bg-[#1a0b2e]/65 border border-[#D4AF37]/20 rounded-2xl p-5 space-y-5 shadow-xl">
            <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-[#D4AF37]/15 pb-2 uppercase tracking-wider">
              Control Panel
            </h2>

            {/* Price inputs */}
            <div className="space-y-3 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Gold 22K (1g)</label>
                  <input
                    type="number"
                    value={gold1g}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setGold1g(val);
                      setGold8g(val * 8);
                    }}
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Gold 22K (8g)</label>
                  <input
                    type="number"
                    value={gold8g}
                    onChange={(e) => setGold8g(Number(e.target.value))}
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Silver (1g)</label>
                <input
                  type="number"
                  value={silver1g}
                  onChange={(e) => setSilver1g(Number(e.target.value))}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Price Trend (Gold)</label>
                  <input
                    type="number"
                    value={trendGold}
                    onChange={(e) => setTrendGold(Number(e.target.value))}
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F3E5AB]/70 font-semibold mb-1 uppercase tracking-wider">Tamil Banner Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-xs"
                  placeholder="e.g. தங்கம் விலை கிராமுக்கு 60 ரூபாய் உயர்ந்தது"
                />
              </div>
            </div>

            {/* Template selector */}
            <div>
              <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2 font-sans">
                Select Design Template
              </label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full bg-[#0c0418] border border-[#D4AF37]/25 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-xs font-sans"
              >
                <option value="peacock">Peacock Classic (Purple & Gold)</option>
                <option value="emerald">Royal Emerald (Emerald & Gold)</option>
                <option value="crimson">Crimson Wedding (Crimson & Gold)</option>
              </select>
            </div>

            {/* Format selector */}
            <div>
              <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2 font-sans">
                Banners Format / Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "post", label: "Square", icon: Square },
                  { id: "story", label: "Story", icon: Smartphone },
                  { id: "facebook", label: "Landscape", icon: Layout }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as any)}
                    className={`py-2 rounded-lg text-xs font-semibold font-sans flex flex-col items-center justify-center space-y-1 transition-all ${
                      format === f.id
                        ? "bg-[#D4AF37] text-[#1a0b2e]"
                        : "bg-[#0c0418] text-[#F3E5AB]/70 border border-[#D4AF37]/15 hover:border-[#D4AF37]/40"
                    }`}
                  >
                    <f.icon className="h-4 w-4" />
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jewelry visual selectors (Applicable to Crimson Template) */}
            {templateId === "crimson" && (
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2 font-sans">
                  Jewellery Overlay Icon
                </label>
                <select
                  value={jewelryType}
                  onChange={(e) => setJewelryType(e.target.value)}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/25 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37] text-xs font-sans"
                >
                  <option value="necklace">Bridal Necklace</option>
                  <option value="bangle">Gold Bangle</option>
                  <option value="ring">Gold Ring</option>
                </select>
              </div>
            )}

            {/* Local Save & Export */}
            <div className="pt-4 border-t border-[#D4AF37]/15 space-y-2">
              <button
                onClick={handleSaveToHistory}
                className="w-full flex items-center justify-center py-2.5 bg-[#1a0b2e] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-bold rounded-lg uppercase tracking-wider transition-all"
              >
                <Save className="h-4 w-4 mr-2" /> Save to History Log
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleExport("png")}
                  className="flex items-center justify-center py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  <Download className="h-4 w-4 mr-1.5" /> PNG
                </button>
                <button
                  onClick={() => handleExport("jpg")}
                  className="flex items-center justify-center py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] text-xs font-bold rounded-lg uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  <Download className="h-4 w-4 mr-1.5" /> JPEG
                </button>
              </div>
            </div>

            {/* Sharing list */}
            <div className="pt-2 border-t border-[#D4AF37]/10">
              <span className="block text-[10px] font-bold text-[#F3E5AB]/50 uppercase tracking-widest text-center mb-3">
                Quick Share Rates
              </span>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={getShareUrl("whatsapp")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 rounded bg-emerald-600/10 hover:bg-emerald-600/35 border border-emerald-600/30 text-emerald-400 text-xs transition-colors"
                  title="WhatsApp"
                >
                  WhatsApp
                </a>
                <a
                  href={getShareUrl("telegram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 rounded bg-sky-600/10 hover:bg-sky-600/35 border border-sky-600/30 text-sky-400 text-xs transition-colors"
                  title="Telegram"
                >
                  Telegram
                </a>
                <a
                  href={getShareUrl("facebook")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 rounded bg-blue-600/10 hover:bg-blue-600/35 border border-blue-600/30 text-blue-400 text-xs transition-colors"
                  title="Facebook"
                >
                  Facebook
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center py-2 rounded bg-purple-600/10 hover:bg-purple-600/35 border border-purple-600/30 text-purple-400 text-xs transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* 2. SVG Canvas Preview (Center 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2 font-sans">
              Live Canvas Preview ({targetDims.width}x{targetDims.height})
            </span>

            <div 
              style={{ width: `${dims.width}px`, height: `${dims.height}px` }} 
              className="bg-[#0c0418] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
            >
              {/* Dynamic SVG Drawing Panel */}
              <svg
                ref={svgRef}
                id="poster-svg"
                viewBox={`0 0 ${targetDims.width} ${targetDims.height}`}
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG DEF GRADIENTS */}
                <defs>
                  <linearGradient id="purpleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a0b2e" />
                    <stop offset="100%" stopColor="#0c0418" />
                  </linearGradient>
                  <linearGradient id="emeraldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#07221e" />
                    <stop offset="100%" stopColor="#020e0c" />
                  </linearGradient>
                  <linearGradient id="crimsonBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2d020d" />
                    <stop offset="100%" stopColor="#120105" />
                  </linearGradient>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#F3E5AB" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>

                {/* TEMPLATE BACKGROUND SELECTION */}
                <rect 
                  width="100%" 
                  height="100%" 
                  fill={
                    templateId === "emerald" 
                      ? "url(#emeraldBg)" 
                      : templateId === "crimson" 
                      ? "url(#crimsonBg)" 
                      : "url(#purpleBg)"
                  } 
                />

                {/* TEMPLATE DECORATIONS */}
                {/* 1. Peacock Watermark */}
                {templateId === "peacock" && (
                  <g opacity="0.08" transform={`translate(${targetDims.width/2 - 200}, ${targetDims.height/2 - 200}) scale(0.8)`}>
                    <circle cx="250" cy="250" r="180" fill="none" stroke="#D4AF37" strokeWidth="8" />
                    <path 
                      d="M250,130 C220,130 190,160 190,200 C190,250 250,320 250,350 C250,320 310,250 310,200 C310,160 280,130 250,130 Z" 
                      fill="#D4AF37" 
                    />
                    <circle cx="250" cy="200" r="30" fill="#0c0418" />
                    <circle cx="250" cy="200" r="12" fill="#D4AF37" />
                  </g>
                )}

                {/* 2. Royal Emerald Border Frame */}
                {templateId === "emerald" && (
                  <rect 
                    x="25" 
                    y="25" 
                    width={targetDims.width - 50} 
                    height={targetDims.height - 50} 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="4" 
                    strokeDasharray="15,10"
                  />
                )}

                {/* 3. Crimson Frame Circle Overlay */}
                {templateId === "crimson" && (
                  <circle 
                    cx={targetDims.width/2} 
                    cy={format === "story" ? 650 : format === "post" ? 450 : 250} 
                    r={format === "story" ? 220 : format === "post" ? 180 : 110} 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="3" 
                    opacity="0.25"
                  />
                )}

                {/* SHOWN GRAPHIC OVERLAYS */}
                {/* Logo Branding */}
                <g transform={`translate(${targetDims.width/2}, ${format === "story" ? 180 : format === "post" ? 100 : 70})`}>
                  <circle cx="0" cy="0" r="28" fill="url(#goldGradient)" />
                  <path d="M-10,-12 L10,-12 L12,12 L-12,12 Z" fill="#1a0b2e" transform="scale(0.8)" />
                  
                  <text 
                    x="0" 
                    y="55" 
                    textAnchor="middle" 
                    fill="url(#goldGradient)" 
                    fontSize="28" 
                    fontFamily="serif" 
                    fontWeight="bold" 
                    letterSpacing="4"
                  >
                    SRI VELMAYIL JEWELLERY
                  </text>
                  <text 
                    x="0" 
                    y="80" 
                    textAnchor="middle" 
                    fill="#F3E5AB" 
                    fontSize="13" 
                    letterSpacing="6" 
                    opacity="0.8"
                  >
                    TIRUPUR
                  </text>
                </g>

                {/* Date & Subtitle */}
                <text 
                  x={targetDims.width/2} 
                  y={format === "story" ? 330 : format === "post" ? 220 : 170} 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="22" 
                  fontFamily="sans-serif" 
                  fontWeight="bold" 
                  letterSpacing="1"
                >
                  TODAY'S GOLD RATE
                </text>
                <text 
                  x={targetDims.width/2} 
                  y={format === "story" ? 370 : format === "post" ? 255 : 200} 
                  textAnchor="middle" 
                  fill="#D4AF37" 
                  fontSize="24" 
                  fontFamily="serif" 
                  fontWeight="bold"
                >
                  {displayDateStr}
                </text>

                {/* MAIN PRICE DISPLAY BLOCKS */}
                {/* 1. Square & Landscape Formats */}
                {format !== "story" && (
                  <g transform={`translate(${targetDims.width/2}, ${format === "post" ? 480 : 340})`}>
                    {/* 22K 1g Block */}
                    <g transform="translate(-200, 0)">
                      <rect x="-130" y="-80" width="260" height="150" fill="none" stroke="#D4AF37" strokeWidth="2" rx="10" />
                      <text x="0" y="-40" textAnchor="middle" fill="#F3E5AB" fontSize="14" fontWeight="bold">GOLD 22K (1 GM)</text>
                      <text x="0" y="20" textAnchor="middle" fill="#ffffff" fontSize="38" fontWeight="bold" fontFamily="serif">
                        ₹{gold1g.toLocaleString("en-IN")}
                      </text>
                    </g>
                    {/* 22K 8g Block */}
                    <g transform="translate(200, 0)">
                      <rect x="-130" y="-80" width="260" height="150" fill="none" stroke="#D4AF37" strokeWidth="2" rx="10" />
                      <text x="0" y="-40" textAnchor="middle" fill="#F3E5AB" fontSize="14" fontWeight="bold">GOLD 22K (8 GM)</text>
                      <text x="0" y="20" textAnchor="middle" fill="#ffffff" fontSize="38" fontWeight="bold" fontFamily="serif">
                        ₹{gold8g.toLocaleString("en-IN")}
                      </text>
                    </g>
                    {/* Silver Block */}
                    <g transform={`translate(0, ${format === "post" ? 140 : 100})`}>
                      <rect x="-160" y="-40" width="320" height="80" fill="#D4AF37" fillOpacity="0.1" stroke="#D4AF37" strokeWidth="1" rx="8" />
                      <text x="-140" y="8" textAnchor="start" fill="#F3E5AB" fontSize="14" fontWeight="bold">SILVER (1 GM)</text>
                      <text x="140" y="10" textAnchor="end" fill="#ffffff" fontSize="26" fontWeight="bold" fontFamily="serif">
                        ₹{silver1g.toLocaleString("en-IN")}
                      </text>
                    </g>
                  </g>
                )}

                {/* 2. Portrait / Story Format */}
                {format === "story" && (
                  <g transform={`translate(${targetDims.width/2}, 780)`}>
                    {/* 22K 8g circle bubble */}
                    <g transform="translate(0, -260)">
                      <circle cx="0" cy="0" r="160" fill="#1a0b2e" stroke="#D4AF37" strokeWidth="4" />
                      <text x="0" y="-70" textAnchor="middle" fill="#F3E5AB" fontSize="15" letterSpacing="2" fontWeight="bold">22K GOLD</text>
                      <text x="0" y="-30" textAnchor="middle" fill="#F3E5AB" fontSize="20" fontWeight="bold">8 GRAMS</text>
                      <text x="0" y="40" textAnchor="middle" fill="url(#goldGradient)" fontSize="44" fontWeight="extrabold" fontFamily="serif">
                        ₹{gold8g.toLocaleString("en-IN")}
                      </text>
                    </g>

                    {/* 22K 1g circle bubble */}
                    <g transform="translate(-160, 100)">
                      <circle cx="0" cy="0" r="120" fill="#1a0b2e" stroke="#D4AF37" strokeWidth="3" />
                      <text x="0" y="-40" textAnchor="middle" fill="#F3E5AB" fontSize="12" letterSpacing="1" fontWeight="bold">22K GOLD</text>
                      <text x="0" y="-15" textAnchor="middle" fill="#F3E5AB" fontSize="15" fontWeight="bold">1 GRAM</text>
                      <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="bold" fontFamily="serif">
                        ₹{gold1g.toLocaleString("en-IN")}
                      </text>
                    </g>

                    {/* Silver circle bubble */}
                    <g transform="translate(160, 100)">
                      <circle cx="0" cy="0" r="120" fill="#1a0b2e" stroke="#D4AF37" strokeWidth="3" />
                      <text x="0" y="-40" textAnchor="middle" fill="#F3E5AB" fontSize="12" letterSpacing="1" fontWeight="bold">FINE SILVER</text>
                      <text x="0" y="-15" textAnchor="middle" fill="#F3E5AB" fontSize="15" fontWeight="bold">1 GRAM</text>
                      <text x="0" y="30" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="bold" fontFamily="serif">
                        ₹{silver1g.toLocaleString("en-IN")}
                      </text>
                    </g>
                  </g>
                )}

                {/* Optional Custom Jewelry Overlay (Bangle, Ring, Necklace shapes in Crimson template) */}
                {templateId === "crimson" && (
                  <g 
                    opacity="0.3" 
                    fill="none" 
                    stroke="#D4AF37" 
                    strokeWidth="3"
                    transform={`translate(${targetDims.width/2}, ${
                      format === "story" ? 1280 : format === "post" ? 820 : 500
                    }) scale(${format === "facebook" ? 0.7 : 1.1})`}
                  >
                    {jewelryType === "necklace" && (
                      <path d="M-100,-40 C-60,50 60,50 100,-40 C100,-40 120,-10 60,80 C10,120 -10,120 -60,80 C-120,-10 -100,-40 -100,-40" />
                    )}
                    {jewelryType === "bangle" && (
                      <>
                        <circle cx="-20" cy="0" r="50" />
                        <circle cx="20" cy="0" r="50" />
                      </>
                    )}
                    {jewelryType === "ring" && (
                      <>
                        <circle cx="0" cy="20" r="30" />
                        <polygon points="0,-25 -20,-10 20,-10" />
                        <circle cx="0" cy="-20" r="10" fill="#D4AF37" />
                      </>
                    )}
                  </g>
                )}

                {/* Tamil Text Message Banner */}
                {message && (
                  <g transform={`translate(${targetDims.width/2}, ${
                    format === "story" ? 1500 : format === "post" ? 880 : 540
                  })`}>
                    <rect 
                      x="-380" 
                      y="-30" 
                      width="760" 
                      height="60" 
                      fill="#D4AF37" 
                      fillOpacity="0.12" 
                      stroke="#D4AF37" 
                      strokeWidth="1.5" 
                      rx="8" 
                    />
                    <text 
                      x="0" 
                      y="8" 
                      textAnchor="middle" 
                      fill="#F3E5AB" 
                      fontSize="20" 
                      fontWeight="bold"
                    >
                      {message}
                    </text>
                  </g>
                )}

                {/* Footer Brand Verification & Contacts */}
                <g transform={`translate(${targetDims.width/2}, ${
                  format === "story" ? 1780 : format === "post" ? 990 : 590
                })`}>
                  <line x1="-400" y1="-30" x2="400" y2="-30" stroke="rgba(212,175,55,0.2)" strokeWidth="1.5" />
                  
                  {/* BIS Logo */}
                  <g transform="translate(-320, 0) scale(0.7)">
                    <polygon points="0,-15 -18,15 18,15" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
                    <text x="0" y="30" textAnchor="middle" fill="#D4AF37" fontSize="10" fontWeight="bold">BIS 916</text>
                  </g>
                  
                  {/* Phone */}
                  <g transform="translate(-100, 5)">
                    <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="bold">📞 9443476183</text>
                  </g>

                  {/* Address */}
                  <g transform="translate(180, 5)">
                    <text x="0" y="0" textAnchor="middle" fill="#F3E5AB" fontSize="13" opacity="0.8">📍 89 New Market St, Tirupur</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* 3. History Logs Sidebar (Right 3 Columns) */}
          <div className="lg:col-span-3 bg-[#1a0b2e]/50 border border-[#D4AF37]/15 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="font-serif text-lg font-bold text-[#D4AF37] border-b border-[#D4AF37]/10 pb-2 uppercase tracking-wider">
              Saved History
            </h2>

            {/* Search filter */}
            <div className="relative font-sans text-xs">
              <Search className="h-4 w-4 text-[#F3E5AB]/40 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by date (YYYY-MM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-[#D4AF37] text-xs"
              />
            </div>

            {/* History List */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-[#F3E5AB]/40 italic text-center py-6 font-sans">
                  No saved posters found.
                </p>
              ) : (
                filteredHistory.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleLoadHistory(rec)}
                    className="p-3 bg-[#0c0418]/65 border border-[#D4AF37]/10 rounded-xl hover:border-[#D4AF37]/45 transition-colors cursor-pointer group flex items-center justify-between"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-1.5 text-[#D4AF37] font-semibold font-sans">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatIndianDate(rec.date)}</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#F3E5AB]/60">
                        Gold: ₹{rec.gold22k_1g}/g • Silver: ₹{rec.silver_1g}/g
                      </div>
                      <div className="text-[10px] text-[#F3E5AB]/50 font-sans italic capitalize">
                        {rec.templateId} • {rec.format}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteHistory(rec.id, e)}
                      className="p-1.5 text-[#F3E5AB]/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[10px] text-[#F3E5AB]/40 italic leading-relaxed text-center font-sans border-t border-[#D4AF37]/10 pt-3">
              Poster configurations are stored locally in your browser cache.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
