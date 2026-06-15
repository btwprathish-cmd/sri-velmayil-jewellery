"use client";

import { Phone } from "lucide-react";
import { BRAND } from "@/utils/brand";
import { DEFAULT_POSTER_BRAND } from "@/lib/poster-brand";
import type { PosterBrandSettings } from "@/lib/poster-brand";

export interface PosterRates {
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  dateLabel: string;
}

interface PosterTemplateProps {
  rates: PosterRates;
  artworkUrl: string;
  brand?: PosterBrandSettings;
}

const GOLD_GRADIENT = "linear-gradient(180deg, #F8E9B0 0%, #E8C547 35%, #D4AF37 65%, #A67C00 100%)";
const SILVER_BAR_GRAD = "linear-gradient(90deg, #E8C547 0%, #D4AF37 50%, #2A6B6B 100%)";
const BASE_BG = "#0B3D45";

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

/** Ornate scalloped gold rate card — locked brand design */
function GoldRateCard({ grams, price }: { grams: string; price: number }) {
  return (
    <div className="relative flex-1" style={{ minWidth: 0 }}>
      <svg
        viewBox="0 0 420 200"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="cardGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8E9B0" />
            <stop offset="45%" stopColor="#E8C547" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>
          <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>
        <path
          d="M30,18 L50,8 L70,18 L90,8 L110,18 L130,8 L150,18 L170,8 L190,18 L210,8 L230,18 L250,8 L270,18 L290,8 L310,18 L330,8 L350,18 L370,8 L390,18
             L400,38 L400,162 L390,182 L370,192 L350,182 L330,192 L310,182 L290,192 L270,182 L250,192 L230,182 L210,192 L190,182 L170,192 L150,182 L130,192 L110,182 L90,192 L70,182 L50,192 L30,182
             L20,162 L20,38 Z"
          fill="url(#cardGold)"
          stroke="#B8860B"
          strokeWidth="2"
          filter="url(#cardShadow)"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        style={{ color: "#1a1208", fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
      >
        <p className="text-[22px] font-semibold leading-tight">Gold Rate</p>
        <p className="text-[26px] font-bold tracking-wide mt-1">{grams}</p>
        <p
          className="text-[44px] font-black leading-none mt-2"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          ₹ {fmt(price)}
        </p>
      </div>
    </div>
  );
}

function SilverRateBar({ price }: { price: number }) {
  return (
    <div
      className="mx-auto flex items-center justify-center gap-6 rounded-full px-10 py-3 mt-4"
      style={{
        background: SILVER_BAR_GRAD,
        maxWidth: 520,
        boxShadow: "0 3px 12px rgba(0,0,0,0.35)",
      }}
    >
      <span
        className="text-[22px] font-bold"
        style={{ color: "#1a1208", fontFamily: "var(--font-poppins)" }}
      >
        Silver
      </span>
      <span
        className="text-[22px] font-bold"
        style={{ color: "#1a1208", fontFamily: "var(--font-poppins)" }}
      >
        1GM
      </span>
      <span
        className="text-[28px] font-black"
        style={{ color: "#1a1208", fontFamily: "var(--font-poppins)" }}
      >
        ₹ {fmt(price)}
      </span>
    </div>
  );
}

export default function PosterTemplate({ rates, artworkUrl, brand }: PosterTemplateProps) {
  const b = brand ?? DEFAULT_POSTER_BRAND;

  return (
    <div
      id="poster-canvas"
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1920,
        background: BASE_BG,
        fontFamily: "var(--font-poppins), Poppins, sans-serif",
      }}
    >
      {/* ZONE 1 — Locked brand header */}
      <div
        className="flex flex-col items-center justify-center shrink-0 pt-6 pb-2"
        style={{ height: 320, background: `linear-gradient(180deg, ${BASE_BG} 0%, #0a3238 100%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={b.logo}
          alt="Sri Velmayil Jewellery Logo"
          width={200}
          height={200}
          className="w-[200px] h-auto object-contain"
          crossOrigin="anonymous"
        />
        <h1
          className="mt-1 text-center leading-none tracking-[0.12em]"
          style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: 42,
            fontWeight: 700,
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SRI VELMAYIL
        </h1>
        <h2
          className="text-center leading-none tracking-[0.14em] mt-1"
          style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: 36,
            fontWeight: 600,
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          JEWELLERY
        </h2>
        <div className="flex items-center gap-3 mt-3">
          <span className="h-px w-12" style={{ background: "#D4AF37", opacity: 0.7 }} />
          <span
            className="text-[18px] tracking-[0.3em] uppercase font-semibold"
            style={{
              color: "#D4AF37",
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
            }}
          >
            {BRAND.location}
          </span>
          <span className="h-px w-12" style={{ background: "#D4AF37", opacity: 0.7 }} />
        </div>
      </div>

      {/* ZONE 2 — AI artwork only (variable zone) */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: 1000 }}>
        {artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artworkUrl}
            alt="Jewellery artwork"
            className="w-full h-full object-cover object-center"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm opacity-50"
            style={{ color: "#a8d4c8" }}
          >
            Artwork loading…
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${BASE_BG} 0%, transparent 100%)` }}
        />
      </div>

      {/* ZONE 3 — Locked rate section (values only change) */}
      <div
        className="shrink-0 px-10 pt-2 pb-4"
        style={{ background: BASE_BG }}
      >
        <div
          className="flex items-center justify-between mb-4 px-2"
          style={{ color: "#ffffff" }}
        >
          <p
            className="text-[28px] font-black uppercase tracking-wide"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Today&apos;s Gold Rate
          </p>
          <p
            className="text-[26px] font-bold uppercase tracking-wide text-right"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {rates.dateLabel}
          </p>
        </div>

        <div className="flex gap-5 px-2">
          <GoldRateCard grams="1GM 22K" price={rates.gold22k_1g} />
          <GoldRateCard grams="8GM 22K" price={rates.gold22k_8g} />
        </div>

        <SilverRateBar price={rates.silver_1g} />
      </div>

      {/* ZONE 4 — Locked contact footer (no promotional text) */}
      <div
        className="mt-auto flex items-center justify-between px-10 shrink-0"
        style={{
          height: 140,
          background: "linear-gradient(180deg, #061e22 0%, #041418 100%)",
          borderTop: "1px solid rgba(212,175,55,0.25)",
        }}
      >
        <div className="flex flex-col items-center gap-1" style={{ width: 200 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.hallmarkImage}
            alt="BIS Hallmark"
            width={44}
            height={44}
            className="w-11 h-11 object-contain"
            crossOrigin="anonymous"
          />
          <span
            className="text-[11px] font-bold tracking-wide text-center"
            style={{ color: "#D4AF37" }}
          >
            {b.hallmarkLabel}
          </span>
        </div>

        <div className="flex items-center gap-2" style={{ color: "#D4AF37" }}>
          <Phone className="h-6 w-6 shrink-0" strokeWidth={2.5} />
          <span
            className="text-[28px] font-bold tracking-wide"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {b.phone}
          </span>
        </div>

        <div
          className="text-right leading-snug"
          style={{ width: 280, color: "#ffffff", fontSize: 18, fontWeight: 500 }}
        >
          {(() => {
            const comma = b.address.indexOf(",");
            if (comma === -1) return <span className="block">{b.address}</span>;
            return (
              <>
                <span className="block">{b.address.slice(0, comma + 1)}</span>
                <span className="block">{b.address.slice(comma + 1).trim()}</span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
