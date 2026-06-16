import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Gem, Award, MapPin, Phone, Clock } from "lucide-react";
import SchemaMarkup, { getJewelryStoreSchema, getOrganizationSchema } from "@/components/SchemaMarkup";
import GoldRateTicker from "@/components/GoldRateTicker";
import HeroSlideshow from "@/components/HeroSlideshow";
import FAQ from "@/components/FAQ";
import { fetchLatestRate, type LiveRateRecord } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";

const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860,
  gold22k_8g: 110880,
  silver_1g: 270,
  gold24k_1g: 15131,
  source: "fallback",
  fetchedAt: new Date().toISOString(),
};

export default function HomePage() {
  const [latestRate, setLatestRate] = useState<LiveRateRecord | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    fetchLatestRate()
      .then((r) => { setLatestRate(r); setRateLoading(false); })
      .catch(() => { setLatestRate(FALLBACK_RATE); setRateLoading(false); setRateError(false); });
  }, []);

  const displayRate = latestRate ?? FALLBACK_RATE;
  const formattedDate = formatIndianDate(displayRate.date);

  return (
    <>
      <SchemaMarkup data={getOrganizationSchema()} />
      <SchemaMarkup data={getJewelryStoreSchema()} />

      {/* TICKER — above everything, full-width */}
      <GoldRateTicker rate={latestRate} loading={rateLoading} error={rateError} />

      <div className="relative">
        {/* HERO SLIDESHOW */}
        <HeroSlideshow
          formattedDate={formattedDate}
          gold22k={displayRate.gold22k_1g}
          gold22k8g={displayRate.gold22k_8g}
          silver={displayRate.silver_1g}
          gold24k={displayRate.gold24k_1g}
          onViewHistory="/gold-rate-history"
        />

        {/* COLLECTIONS — Gold & Silver */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Our Collections
            </h2>
            <p className="text-sm sm:text-base text-[#F3E5AB]/70 font-sans">
              Hand-crafted masterpieces reflecting Tamil Nadu's legacy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Gold Collections */}
            <Link
              href="/jewellery-collections"
              className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl"
              style={{ minHeight: "320px" }}
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
                alt="Gold Collections at Sri Velmayil Jewellery Tirupur"
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/90 via-[#0c0418]/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">BIS 916 Hallmarked</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Gold Collections</h3>
                <p className="text-sm text-[#F3E5AB]/75 font-sans mb-4 max-w-xs">
                  Necklaces, bangles, rings & bridal sets — crafted for every occasion.
                </p>
                <span className="inline-flex items-center text-sm font-bold text-[#D4AF37] group-hover:text-[#F3E5AB] transition-colors">
                  Explore Gold
                  <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Silver Collections */}
            <Link
              href="/silver-rate-today-tirupur"
              className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 shadow-xl"
              style={{ minHeight: "320px" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2a2a4e] to-[#0f0f1e]" />
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  backgroundImage: "radial-gradient(circle at 30% 40%, rgba(192,192,215,0.5) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(160,160,200,0.3) 0%, transparent 50%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-white/80" />
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Purity 99.9%</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">Silver Collections</h3>
                <p className="text-sm text-white/65 font-sans mb-4 max-w-xs">
                  Fine silver ornaments, coins & articles at today's live silver rate.
                </p>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-xs text-white/50 font-sans">Today's Silver Rate</p>
                    <p className="font-serif text-2xl font-bold text-white">
                      ₹{displayRate.silver_1g.toLocaleString("en-IN")}<span className="text-sm font-sans font-normal text-white/60">/g</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center text-sm font-bold text-white/80 group-hover:text-white transition-colors ml-auto">
                    View Silver
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* TRUST SIGNALS */}
        <section className="py-20 bg-gradient-to-b from-[#0c0418] to-[#110522] border-t border-[#D4AF37]/10 text-[#F3E5AB]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: ShieldCheck, title: "BIS 916 Hallmark", desc: "We guarantee 100% purity. Every gold item features the standard BIS triangle, purity rating, and HUID registry numbers." },
                { icon: Gem, title: "Exquisite Craftsmanship", desc: "From traditional Tamil heritage bridal designs to light-weight modern jewellery, our master artisans craft each piece to perfection." },
                { icon: Award, title: "Generations of Trust", desc: "Serving families in Tirupur with honesty and transparency. Our pricing lists separate gold value, making charges, and GST clearly." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shadow-lg">
                    <Icon className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">{title}</h3>
                  <p className="text-sm text-[#F3E5AB]/75 leading-relaxed max-w-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / MAP */}
        <section className="py-20 bg-[#090313] border-t border-[#D4AF37]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                  Visit Our Tirupur Showroom
                </h2>
                <p className="text-sm sm:text-base text-[#F3E5AB]/75 font-sans leading-relaxed">
                  Experience the purity of our jewellery in person. Our friendly showroom consultants will guide you to find the perfect ornaments.
                </p>
                <div className="space-y-4 font-sans text-sm sm:text-base">
                  {[
                    { icon: MapPin, title: "Address", content: "Sri Velmayil Jewellery, 89 New Market Street, Tirupur, Tamil Nadu 641604" },
                    { icon: Phone, title: "Phone Number", content: "+91 9443476183", href: "tel:+919443476183" },
                    { icon: Clock, title: "Business Hours", content: "Monday - Sunday: 9:30 AM - 9:00 PM" },
                  ].map(({ icon: Icon, title, content, href }) => (
                    <div key={title} className="flex items-start">
                      <Icon className="h-6 w-6 text-[#D4AF37] mr-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white">{title}</h4>
                        {href ? (
                          <a href={href} className="text-[#F3E5AB]/70 hover:text-[#D4AF37] hover:underline">{content}</a>
                        ) : (
                          <p className="text-[#F3E5AB]/70">{content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href="https://maps.google.com/?q=Sri+Velmayil+Jewellery+89+New+Market+Street+Tirupur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold hover:brightness-110 shadow-lg transition-all"
                >
                  Get Directions on Google Maps
                </a>
              </div>
              <div className="h-96 w-full rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl relative">
                <iframe
                  title="Sri Velmayil Jewellery Store Location"
                  src="https://maps.google.com/maps?q=Sri%20Velmayil%20Jewellery%2089%20New%20Market%20Street%20Tirupur%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — above footer */}
        <section className="bg-[#0c0418] border-t border-[#D4AF37]/10">
          <FAQ showCTA={true} />
        </section>
      </div>
    </>
  );
}
