import React, { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  alt: string;
  ctaHref: string;
  ctaLabel: string;
  btn: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width: string;
    height: string;
  };
}

const slides: Slide[] = [
  {
    image: "/images/slide-gold.png",
    alt: "Gold Jewellery Collection — Sri Velmayil Tirupur",
    ctaHref: "/jewellery-collections/gold",
    ctaLabel: "Explore Gold Collection",
    btn: { bottom: "16%", right: "5%", width: "32%", height: "11%" },
  },
  {
    image: "/images/slide-silver.png",
    alt: "Silver Jewellery Collection — Sri Velmayil Tirupur",
    ctaHref: "/jewellery-collections/silver",
    ctaLabel: "Explore Silver Collection",
    btn: { bottom: "13%", right: "5%", width: "32%", height: "11%" },
  },
  {
    image: "/images/slide-generations.png",
    alt: "Crafted For Generations — Sri Velmayil Tirupur",
    ctaHref: "/jewellery-collections",
    ctaLabel: "Discover Our Collection",
    btn: { bottom: "14%", right: "5%", width: "32%", height: "11%" },
  },
  {
    image: "/images/slide-trust.png",
    alt: "Heritage of Trust — Sri Velmayil Tirupur",
    ctaHref: "/jewellery-collections",
    ctaLabel: "Explore Our Collection",
    btn: { bottom: "13%", left: "5%", width: "30%", height: "11%" },
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

export default function HeroSlideshow(_props: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

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
      onMouseLeave={() => { setPaused(false); setHoveredBtn(false); }}
    >
      {/* Slides */}
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
        </div>
      ))}

      {/* Transparent CTA overlay — sits over the button baked into the image */}
      <Link
        href={slide.ctaHref}
        aria-label={slide.ctaLabel}
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
        style={{
          position: "absolute",
          zIndex: 10,
          cursor: "pointer",
          bottom: slide.btn.bottom,
          top: slide.btn.top,
          left: slide.btn.left,
          right: slide.btn.right,
          width: slide.btn.width,
          height: slide.btn.height,
          borderRadius: "4px",
          transition: "box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease",
          boxShadow: hoveredBtn
            ? "0 0 0 2px rgba(212,175,55,0.7), 0 0 24px 6px rgba(212,175,55,0.35)"
            : "0 0 0 0px transparent",
          transform: hoveredBtn ? "scale(1.04)" : "scale(1)",
          background: hoveredBtn ? "rgba(212,175,55,0.08)" : "transparent",
        }}
      />

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
