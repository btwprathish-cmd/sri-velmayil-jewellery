import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  ctaAlign: "left" | "right";
}

const slides: Slide[] = [
  {
    image: "/images/slide-gold.png",
    alt: "Gold Jewellery Collection — Sri Velmayil Tirupur",
    ctaLabel: "Explore Gold Collection",
    ctaHref: "/jewellery-collections/gold",
    ctaAlign: "right",
  },
  {
    image: "/images/slide-silver.png",
    alt: "Silver Jewellery Collection — Sri Velmayil Tirupur",
    ctaLabel: "Explore Silver Collection",
    ctaHref: "/jewellery-collections/silver",
    ctaAlign: "right",
  },
  {
    image: "/images/slide-generations.png",
    alt: "Crafted For Generations — Sri Velmayil Tirupur",
    ctaLabel: "Discover Our Collection",
    ctaHref: "/jewellery-collections",
    ctaAlign: "right",
  },
  {
    image: "/images/slide-trust.png",
    alt: "Heritage of Trust — Sri Velmayil Tirupur",
    ctaLabel: "Explore Our Collection",
    ctaHref: "/jewellery-collections",
    ctaAlign: "left",
  },
];

interface HeroSlideshowProps {
  formattedDate: string;
  gold22k: number;
  gold22k8g: number;
  silver: number;
  gold24k: number;
  onViewHistory: string;
}

export default function HeroSlideshow({
  formattedDate,
  gold22k,
  gold22k8g,
  silver,
  onViewHistory,
}: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "580px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-bleed slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={s.image}
            alt={s.alt}
            className="w-full h-full object-cover object-center"
            style={{ minHeight: "580px" }}
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Subtle bottom gradient so rate card stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* CTA button — positioned bottom-right or bottom-left matching each image */}
      <div
        className={`absolute z-20 bottom-16 sm:bottom-20 ${
          slide.ctaAlign === "left"
            ? "left-6 sm:left-12 lg:left-20"
            : "right-6 sm:right-12 lg:right-20 xl:right-32"
        } transition-all duration-500`}
      >
        <Link
          href={slide.ctaHref}
          className="inline-flex items-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 border-2 border-[#D4AF37] text-[#D4AF37] bg-[#0c0418]/40 hover:bg-[#D4AF37] hover:text-[#1a0b2e] font-bold text-xs sm:text-sm uppercase tracking-widest rounded-none transition-all duration-300 backdrop-blur-sm shadow-lg"
        >
          {slide.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Rate card — bottom-left floating panel */}
      <div className="absolute z-20 bottom-4 left-4 sm:bottom-6 sm:left-6 hidden lg:block">
        <div className="bg-[#0c0418]/85 border border-[#D4AF37]/30 rounded-xl px-5 py-4 shadow-2xl backdrop-blur-sm max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
              Tirupur Live Rates
            </p>
            <span className="text-[9px] bg-[#D4AF37] text-[#1a0b2e] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              {formattedDate}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { label: "22K Gold (916)", value: `₹${gold22k.toLocaleString("en-IN")}/g` },
              { label: "22K Sovereign (8g)", value: `₹${gold22k8g.toLocaleString("en-IN")}` },
              { label: "Fine Silver 99.9%", value: `₹${silver.toLocaleString("en-IN")}/g` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center gap-6">
                <span className="text-[11px] text-[#F3E5AB]/70 font-sans">{label}</span>
                <span className="text-[13px] font-bold text-[#D4AF37] font-mono whitespace-nowrap">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#D4AF37]/15">
            <Link
              href={onViewHistory}
              className="text-[10px] font-bold text-[#D4AF37]/80 hover:text-[#D4AF37] uppercase tracking-wider inline-flex items-center gap-1"
            >
              View Historical Chart <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0c0418]/60 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-[#0c0418]/60 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-6 h-2 bg-[#D4AF37]" : "w-2 h-2 bg-[#D4AF37]/40 hover:bg-[#D4AF37]/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
