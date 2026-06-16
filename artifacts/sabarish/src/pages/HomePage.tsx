import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Award, Gem, ShieldCheck, MapPin, Phone, Clock } from "lucide-react";
import SchemaMarkup, { getJewelryStoreSchema, getOrganizationSchema } from "@/components/SchemaMarkup";
import RateCalculator from "@/components/RateCalculator";
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

const featuredCollections = [
  {
    name: "Gold Necklaces",
    slug: "gold-necklaces",
    description: "Exquisite bridal harams, classic chokers, and modern designs.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    cta: "Explore Necklaces",
  },
  {
    name: "Gold Bangles",
    slug: "gold-bangles",
    description: "Traditional temple kangans and sleek rope daily-wear styles.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    cta: "Explore Bangles",
  },
  {
    name: "Gold Rings",
    slug: "gold-rings",
    description: "Stunning wedding bands, filigree designs, and men's signet rings.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    cta: "Explore Rings",
  },
];

export default function HomePage() {
  const [latestRate, setLatestRate] = useState<LiveRateRecord>(FALLBACK_RATE);

  useEffect(() => {
    fetchLatestRate().then(setLatestRate).catch(() => {});
  }, []);

  const formattedDate = formatIndianDate(latestRate.date);

  return (
    <>
      <SchemaMarkup data={getOrganizationSchema()} />
      <SchemaMarkup data={getJewelryStoreSchema()} />

      <div className="relative min-h-screen">
        {/* HERO */}
        <section className="relative overflow-hidden pt-24 pb-20 sm:pb-28 lg:pt-32">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
                  <Award className="h-4 w-4 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">100% BIS 916 Hallmarked Jewellery</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  Crafting Purity &<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
                    Timeless Elegance
                  </span><br />
                  in Tirupur
                </h1>
                <p className="text-[#F3E5AB]/75 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  For generations, Sri Velmayil Jewellery has been the hallmark of trust and purity in Tirupur. Explore our handcrafted bridal collections, daily wear ornaments, and secure your investments with absolute peace of mind.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
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

              <div className="lg:col-span-5">
                <div className="bg-[#1a0b2e]/80 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1a0b2e] font-sans font-bold text-[10px] px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                    Live Rates
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] font-bold mb-4">
                    Tirupur Gold Rate Today
                  </h2>
                  <p className="text-xs text-[#F3E5AB]/65 mb-6 uppercase tracking-wider">
                    Rates updated for {formattedDate}
                  </p>
                  <div className="space-y-4">
                    {[
                      { label: "22K Gold (916)", sub: "Ideal for ornaments", value: latestRate.gold22k_1g, unit: "Per 1 Gram" },
                      { label: "22K Gold (Sovereign)", sub: "8 Gram Board Rate", value: latestRate.gold22k_8g, unit: "Per 8 Grams" },
                      { label: "Fine Silver", sub: "Purity 99.9%", value: latestRate.silver_1g, unit: "Per 1 Gram" },
                    ].map(({ label, sub, value, unit }) => (
                      <div key={label} className="flex justify-between items-center bg-[#0c0418]/60 p-4 rounded-xl border border-[#D4AF37]/10">
                        <div>
                          <span className="font-sans font-bold text-lg text-white">{label}</span>
                          <p className="text-xs text-[#F3E5AB]/60">{sub}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-2xl font-bold text-[#D4AF37] font-mono">
                            ₹{value.toLocaleString("en-IN")}
                          </span>
                          <p className="text-[10px] text-[#F3E5AB]/50">{unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link
                      href="/gold-rate-history"
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
        </section>

        {/* CALCULATOR */}
        <section className="py-16 bg-[#090313] border-y border-[#D4AF37]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                Plan Your Purchase
              </h2>
              <p className="text-sm text-[#F3E5AB]/70 font-sans mt-2">
                Calculate the transparent cost of your jewellery items based on current market rates.
              </p>
            </div>
            <RateCalculator today22kRate={latestRate.gold22k_1g} />
          </div>
        </section>

        {/* COLLECTIONS */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Explore Our Jewellery Collections
            </h2>
            <p className="text-sm sm:text-base text-[#F3E5AB]/70 font-sans">
              Hand-crafted masterpieces reflecting Tamil Nadu's legacy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((col) => (
              <div key={col.slug} className="group bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between shadow-xl">
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                  <img
                    src={col.image}
                    alt={`${col.name} at Sri Velmayil Jewellery Tirupur`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent opacity-80"></div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#F3E5AB]">{col.name}</h3>
                  <p className="text-sm text-[#F3E5AB]/65 leading-relaxed font-sans">{col.description}</p>
                  <Link
                    href={`/jewellery-collections/${col.slug}`}
                    className="inline-flex items-center text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB] group/link pt-2"
                  >
                    <span>{col.cta}</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
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
      </div>
    </>
  );
}
