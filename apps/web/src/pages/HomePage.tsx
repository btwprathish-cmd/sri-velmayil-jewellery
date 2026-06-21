import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Gem, Award, MapPin, Phone, Clock } from "lucide-react";
import SchemaMarkup, { getJewelryStoreSchema, getOrganizationSchema } from "@/components/SchemaMarkup";
import GoldRateTicker from "@/components/GoldRateTicker";
import HeroSlideshow from "@/components/HeroSlideshow";
import FAQ from "@/components/FAQ";
import { fetchLatestRate, type LiveRateRecord } from "@/utils/rates";
import { formatIndianDate } from "@/utils/date";
import { getMetals } from "@/utils/collections";

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
  const [metalsList, setMetalsList] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestRate()
      .then((r) => { setLatestRate(r); setRateLoading(false); })
      .catch(() => { setLatestRate(FALLBACK_RATE); setRateLoading(false); setRateError(false); });
    setMetalsList(getMetals());
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

        {/* FEATURED COLLECTIONS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Our Featured Collections
            </h2>
            <p className="text-sm sm:text-base text-[#F3E5AB]/70 font-sans">
              Each piece is a testament to 25 years of master craftsmanship — inspired by Tamil Nadu's royal legacy, shaped by hands that have spent decades perfecting their art.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {metalsList.map((metal) => {
              const metalName = metal.name;
              const isSilver = metalName.toLowerCase() === "silver";
              const isGold = metalName.toLowerCase() === "gold";
              const slug = metalName.toLowerCase();
              
              const imageSrc = metal.imageUrl || (isSilver ? "/images/SILVER.jpg" : "/images/GOLD.jpg");

              let ThemeColor = isSilver ? "white" : "#D4AF37";
              let ThemeClass = isSilver ? "white/10" : "[#D4AF37]/20";
              let ThemeHoverClass = isSilver ? "white/30" : "[#D4AF37]/50";
              let TextClass = isSilver ? "white/68" : "[#F3E5AB]/78";

              const purityLabel = metal.purityLabel || (isGold ? "BIS 916 Hallmarked" : isSilver ? "Purity 99.9%" : "Exclusive");
              const description = metal.description || (isGold 
                ? "From intricately crafted necklaces and statement bangles to elegant rings and resplendent bridal sets — each piece born from pure gold and the hands of a master."
                : isSilver 
                ? "Fine silver ornaments, auspicious articles, and investment coins — priced at today's live silver rate with the same purity guarantee we extend to our gold."
                : `Explore our stunning new ${metalName} collection, crafted with perfection and style.`);

              return (
                <Link
                  key={slug}
                  href={`/jewellery-collections${isGold ? '' : `/${slug}`}`}
                  className={`group relative rounded-2xl overflow-hidden border border-${ThemeClass} hover:border-${ThemeHoverClass} transition-all duration-300 shadow-xl`}
                  style={{ minHeight: "320px", borderColor: `rgba(${isSilver ? '255,255,255' : '212,175,55'}, 0.2)` }}
                >
                  <img
                    src={imageSrc}
                    alt={`${metalName} Collections`}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/92 via-[#0c0418]/45 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ThemeColor }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ThemeColor }}>
                        {purityLabel}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-white mb-2">{metalName} Jewellery</h3>
                    <p className="text-sm font-sans mb-4 max-w-xs leading-relaxed" style={{ color: `rgba(243, 229, 171, 0.78)` }}>
                      {description}
                    </p>
                    <span className="inline-flex items-center text-sm font-bold group-hover:brightness-125 transition-colors mt-auto pt-2" style={{ color: ThemeColor }}>
                      Discover {metalName} Collections
                      <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* TRUST SIGNALS */}
        <section className="py-20 bg-gradient-to-b from-[#0c0418] to-[#110522] border-t border-[#D4AF37]/10 text-[#F3E5AB]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                The Sri Velmayil Promise
              </h2>
              <p className="text-sm sm:text-base text-[#F3E5AB]/65 font-sans max-w-2xl mx-auto">
                A quarter century of kept promises — the quiet confidence that only comes from never having cut a corner or compromised a customer's trust.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                {
                  icon: ShieldCheck,
                  title: "BIS 916 Hallmark Guaranteed",
                  desc: "Every ornament carries the government-mandated BIS triangle, 916 purity mark, and HUID laser stamp. Your gold's authenticity is not our claim — it is a legally registered, independently verifiable fact.",
                },
                {
                  icon: Gem,
                  title: "Generations of Artisan Mastery",
                  desc: "From the commanding elegance of a temple-inspired necklace to the delicate intricacy of a custom ring, our master craftsmen pour 25 years of refined skill into every ornament that leaves our workshop.",
                },
                {
                  icon: Award,
                  title: "Transparent Pricing You Can Verify",
                  desc: "We separate gold value, stone charges, making charges, and GST on every bill. Our live rate display ensures you always pay the fair market price — verifiable, honest, and never negotiable in the dark.",
                },
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
                  Some jewellery must be seen, felt, and held to be truly understood. Our Tirupur showroom is an unhurried space where our consultants give you their complete, unrushed attention — because the right ornament deserves the right conversation.
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
