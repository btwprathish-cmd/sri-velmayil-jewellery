"use client";

import { Phone, MapPin } from "lucide-react";
import { BRAND } from "@/utils/brand";
import type { PosterTheme } from "@/lib/poster-themes";

export interface PosterRates {
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  dateLabel: string;
}

interface PosterTemplateProps {
  theme: PosterTheme;
  rates: PosterRates;
  artworkUrl: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

function RatePill({ label, sub, accent }: { label: string; sub: string; accent: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className="px-3 py-0.5 rounded-full text-[11px] font-bold"
        style={{ background: accent, color: "#1a0b2e" }}
      >
        {label}
      </span>
      <span className="text-[13px] font-bold tracking-wide" style={{ color: accent }}>
        {sub}
      </span>
    </div>
  );
}

export default function PosterTemplate({ theme, rates, artworkUrl }: PosterTemplateProps) {
  return (
    <div
      id="poster-canvas"
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 1080,
        height: 1920,
        background: theme.bgGradient,
        fontFamily: "var(--font-poppins), Poppins, sans-serif",
      }}
    >
      {/* ZONE 1 — Brand header (0–420px) */}
      <div className="flex flex-col items-center justify-center pt-10 pb-4" style={{ height: 420 }}>
        {/* Static logo — never AI-generated */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.logo}
          alt="Sri Velmayil Jewellery Logo"
          width={220}
          height={220}
          className="w-[220px] h-auto object-contain"
        />
        <h1
          className="mt-2 text-center tracking-[0.18em] leading-tight"
          style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: 34,
            fontWeight: 700,
            color: theme.accent,
          }}
        >
          SRI VELMAYIL JEWELLERY
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="h-px w-10" style={{ background: theme.accent, opacity: 0.6 }} />
          <span
            className="text-sm tracking-[0.35em] uppercase"
            style={{ color: theme.muted, fontFamily: "var(--font-poppins)" }}
          >
            {BRAND.location}
          </span>
          <span className="h-px w-10" style={{ background: theme.accent, opacity: 0.6 }} />
        </div>
      </div>

      {/* ZONE 2 — Date + rate bar (420–620px) */}
      <div className="px-12" style={{ height: 200 }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2" style={{ color: theme.text }}>
            {(() => {
              const parts = rates.dateLabel.split(" ");
              const day = parts[0] ?? "";
              const month = parts[1] ?? "";
              const year = parts[2] ?? "";
              return (
                <>
                  <span className="text-[72px] font-black leading-none">{day}</span>
                  <div className="flex flex-col pt-1">
                    <span className="text-xl font-bold">{month}</span>
                    <span className="text-xl font-bold">{year}</span>
                  </div>
                </>
              );
            })()}
          </div>
          <div className="text-right" style={{ color: theme.text }}>
            <p className="text-lg opacity-90">Today&apos;s</p>
            <p className="text-[34px] font-black leading-tight">GOLD RATE</p>
          </div>
        </div>

        <div
          className="rounded-2xl border-2 px-4 py-4 grid grid-cols-3"
          style={{ borderColor: theme.accent }}
        >
          {[
            { label: "1GM", sub: "22K", value: rates.gold22k_1g, pill: theme.accent },
            { label: "8GM", sub: "22K", value: rates.gold22k_8g, pill: theme.accent },
            { label: "1GM", sub: "SILVER", value: rates.silver_1g, pill: "#c0c0c0" },
          ].map((col, i) => (
            <div
              key={col.sub + col.label}
              className="flex flex-col items-center gap-2 px-2"
              style={i > 0 ? { borderLeft: `1.5px dashed ${theme.accent}88` } : undefined}
            >
              <RatePill label={col.label} sub={col.sub} accent={col.pill} />
              <p
                className="text-[36px] font-black leading-none mt-1"
                style={{ color: theme.text, fontFamily: "var(--font-poppins)" }}
              >
                ₹{fmt(col.value)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ZONE 3 — AI artwork (620–1620px) */}
      <div className="relative mx-0 overflow-hidden" style={{ height: 1000 }}>
        {artworkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={artworkUrl}
            alt="AI generated jewellery artwork"
            className="w-full h-full object-cover object-center"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-40 text-sm" style={{ color: theme.muted }}>
            Artwork loading…
          </div>
        )}
      </div>

      {/* ZONE 4 — Contact footer (1620–1920px) */}
      <div
        className="flex items-center justify-between px-12 border-t"
        style={{ height: 300, borderColor: `${theme.accent}44` }}
      >
        <div className="flex flex-col items-center gap-1" style={{ color: theme.accent }}>
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
            <polygon points="18,4 4,32 32,32" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="text-[9px] font-bold tracking-wide">{BRAND.hallmark}</span>
        </div>

        <div className="flex flex-col gap-3" style={{ color: theme.text }}>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" style={{ color: theme.accent }} />
            <span className="text-xl font-bold">{BRAND.phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 mt-0.5 shrink-0" style={{ color: theme.accent }} />
            <span className="text-sm leading-snug max-w-[280px]">{BRAND.address}</span>
          </div>
        </div>

        <div className="w-[80px]" />
      </div>
    </div>
  );
}
