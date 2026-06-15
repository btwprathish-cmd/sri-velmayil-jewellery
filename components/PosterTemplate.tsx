"use client";

import { Phone, MapPin } from "lucide-react";
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

const MAROON = "#4a0818";
const MAROON_DARK = "#2d020d";
const GOLD = "#D4AF37";

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

function parseDateParts(dateLabel: string): { day: string; month: string; year: string } {
  const m = dateLabel.match(/(\d+)(st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
  if (m) {
    return {
      day: m[1].padStart(2, "0"),
      month: m[3].slice(0, 3).toUpperCase(),
      year: m[4],
    };
  }
  const parts = dateLabel.split(" ");
  return { day: parts[0] ?? "01", month: (parts[1] ?? "JUN").slice(0, 3).toUpperCase(), year: parts[2] ?? "2026" };
}

function RatePill({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className="px-3 py-0.5 rounded-full text-[11px] font-bold"
        style={{ background: GOLD, color: MAROON_DARK }}
      >
        {label}
      </span>
      <span className="text-[13px] font-bold tracking-wide" style={{ color: GOLD }}>
        {sub}
      </span>
    </div>
  );
}

export default function PosterTemplate({ rates, artworkUrl, brand }: PosterTemplateProps) {
  const b = brand ?? DEFAULT_POSTER_BRAND;
  const d = parseDateParts(rates.dateLabel);

  const cols = [
    { label: "1GM", sub: "22K", value: rates.gold22k_1g },
    { label: "8GM", sub: "22K", value: rates.gold22k_8g },
    { label: "1GM", sub: "SILVER", value: rates.silver_1g, pill: "#c0c0c0" },
  ];

  return (
    <div
      id="poster-canvas"
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1920,
        background: `linear-gradient(180deg, ${MAROON} 0%, ${MAROON_DARK} 100%)`,
        fontFamily: "var(--font-poppins), Poppins, sans-serif",
      }}
    >
      {/* ZONE 1 — Logo + brand (locked) */}
      <div className="flex flex-col items-center justify-center shrink-0 pt-8 pb-2" style={{ height: 300 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={b.logo}
          alt="Sri Velmayil Jewellery Logo"
          width={180}
          height={180}
          className="w-[180px] h-auto object-contain"
          crossOrigin="anonymous"
        />
        <h1
          className="mt-1 text-center tracking-[0.14em] leading-tight"
          style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: 38,
            fontWeight: 700,
            color: GOLD,
          }}
        >
          SRI VELMAYIL JEWELLERY
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="h-px w-10" style={{ background: GOLD, opacity: 0.6 }} />
          <span className="text-sm tracking-[0.35em] uppercase font-semibold" style={{ color: GOLD }}>
            {BRAND.location}
          </span>
          <span className="h-px w-10" style={{ background: GOLD, opacity: 0.6 }} />
        </div>
      </div>

      {/* ZONE 2 — Date + rate bar (locked layout, live values) */}
      <div className="shrink-0 px-12" style={{ height: 210 }}>
        <div className="flex items-start justify-between mb-4" style={{ color: "#ffffff" }}>
          <div className="flex items-start gap-2">
            <span className="text-[72px] font-black leading-none">{d.day}</span>
            <div className="flex flex-col pt-1">
              <span className="text-xl font-bold">{d.month}</span>
              <span className="text-xl font-bold">{d.year}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg opacity-90">Today&apos;s</p>
            <p className="text-[34px] font-black leading-tight">GOLD RATE</p>
          </div>
        </div>

        <div
          className="rounded-2xl border-2 px-4 py-4 grid grid-cols-3"
          style={{ borderColor: GOLD, background: "rgba(0,0,0,0.25)" }}
        >
          {cols.map((col, i) => (
            <div
              key={col.sub + col.label}
              className="flex flex-col items-center gap-2 px-2"
              style={i > 0 ? { borderLeft: `1.5px dashed ${GOLD}88` } : undefined}
            >
              <RatePill label={col.label} sub={col.sub} />
              <p className="text-[36px] font-black leading-none mt-1" style={{ color: "#ffffff" }}>
                ₹{fmt(col.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE 3 — Artwork (variable — AI or reference-style canvas) */}
      <div className="relative shrink-0 overflow-hidden flex-1" style={{ minHeight: 1100 }}>
        {artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artworkUrl}
            alt="Jewellery artwork"
            className="w-full h-full object-cover object-center"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40 text-white text-sm">
            Generating artwork…
          </div>
        )}
      </div>

      {/* ZONE 4 — Contact footer (locked, no Tamil promo text) */}
      <div
        className="shrink-0 flex items-end justify-between px-12 pb-8 pt-4"
        style={{ height: 200, borderTop: `1px solid ${GOLD}44` }}
      >
        <div className="flex flex-col gap-3" style={{ color: "#ffffff" }}>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" style={{ color: GOLD }} />
            <span className="text-xl font-bold">{b.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: GOLD }} />
            <span className="text-sm leading-snug max-w-[320px]">{b.address}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.hallmarkImage}
            alt="BIS Hallmark"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            crossOrigin="anonymous"
          />
          <span className="text-[10px] font-bold tracking-wide" style={{ color: GOLD }}>
            {b.hallmarkLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
