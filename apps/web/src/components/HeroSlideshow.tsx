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
      className="relative overflow-hidden w-full bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setHoveredBtn(false); }}
    >
      {/* Invisible sizer to give the absolute container a fluid height matching the images */}
      <img
        src={slides[0].image}
        className="w-full h-auto invisible pointer-events-none"
        alt=""
        aria-hidden="true"
      />

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
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

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
