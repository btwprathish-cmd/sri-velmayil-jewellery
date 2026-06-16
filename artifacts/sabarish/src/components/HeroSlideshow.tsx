import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, Award, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  alt: string;
  tagline: string;
  sub: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1600",
    alt: "Gold necklace jewellery Sri Velmayil Tirupur",
    tagline: "Crafting Purity & Timeless Elegance",
    sub: "For generations, Sri Velmayil Jewellery has been the hallmark of trust in Tirupur.",
  },
  {
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1600",
    alt: "Gold bangles bridal jewellery Tirupur",
    tagline: "Handcrafted Bridal Collections",
    sub: "Exquisite traditional Tamil Nadu designs for your most precious moments.",
  },
  {
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600",
    alt: "Gold rings wedding jewellery Tirupur",
    tagline: "Investment-Grade Gold Jewellery",
    sub: "100% BIS 916 Hallmarked — purity you can trust, prices that are transparent.",
  },
  {
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1600",
    alt: "Traditional gold jewellery collection Tirupur",
    tagline: "A Legacy of Craftsmanship",
    sub: "From daily-wear ornaments to heavy bridal sets — crafted by master artisans.",
  },
];

// TODO: Replace with actual banner images from the store

interface HeroSlideshowProps {
  formattedDate: string;
  gold22k: number;
  gold22k8g: number;
  silver: number;
  gold24k: number;
  onViewHistory: string;
}

export default function HeroSlideshow({ formattedDate, gold22k, gold22k8g, silver, gold24k, onViewHistory }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full" style={{ minHeight: "600px" }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              style={{ minHeight: "600px" }}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0418]/90 via-[#0c0418]/60 to-[#0c0418]/20" />
          </div>
        ))}

        {/* Content overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
                <Award className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">100% BIS 916 Hallmarked Jewellery</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
                  {slides[current].tagline.split(" ").slice(0, 2).join(" ")}
                </span>
                {" "}{slides[current].tagline.split(" ").slice(2).join(" ")}
              </h1>

              <p className="text-[#F3E5AB]/80 text-base sm:text-lg max-w-xl leading-relaxed font-sans">
                {slides[current].sub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/jewellery-collections"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-[#1a0b2e] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 shadow-lg shadow-[#D4AF37]/10 transition-all duration-200"
                >
                  View Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/gold-rate-today-tirupur"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[#D4AF37]/45 text-base font-bold rounded-lg text-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all duration-200"
                >
                  Check Today's Rate
                </Link>
              </div>
            </div>

            {/* Rate card */}
            <div className="lg:col-span-5">
              <div className="bg-[#1a0b2e]/85 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1a0b2e] font-sans font-bold text-[10px] px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                  Live Rates
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] font-bold mb-2">
                  Tirupur Gold Rate Today
                </h2>
                <p className="text-xs text-[#F3E5AB]/65 mb-5 uppercase tracking-wider">
                  Rates updated for {formattedDate}
                </p>
                <div className="space-y-3">
                  {[
                    { label: "22K Gold (916)", sub: "Ideal for ornaments", value: gold22k, unit: "Per 1 Gram" },
                    { label: "22K Gold (Sovereign)", sub: "8 Gram Board Rate", value: gold22k8g, unit: "Per 8 Grams" },
                    { label: "Fine Silver", sub: "Purity 99.9%", value: silver, unit: "Per 1 Gram" },
                  ].map(({ label, sub, value, unit }) => (
                    <div key={label} className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                      <div>
                        <span className="font-sans font-bold text-base text-white">{label}</span>
                        <p className="text-xs text-[#F3E5AB]/60">{sub}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-xl font-bold text-[#D4AF37] font-mono">
                          ₹{value.toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-[#F3E5AB]/50">{unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <Link
                    href={onViewHistory}
                    className="text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] inline-flex items-center space-x-1 hover:underline uppercase tracking-wider"
                  >
                    <span>View Historical Rate Chart</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#1a0b2e]/70 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#1a0b2e]/70 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Navigation dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-[#D4AF37]"
                  : "w-2.5 h-2.5 bg-[#D4AF37]/35 hover:bg-[#D4AF37]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
