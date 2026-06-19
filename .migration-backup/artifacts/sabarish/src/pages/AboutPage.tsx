import React from "react";
import { Link } from "wouter";
import { Award, ShieldCheck, Heart, Users, CheckCircle, ArrowRight, Gem, Clock, Star, Sparkles, Scale, Headphones } from "lucide-react";

const whyChooseUs = [
  {
    icon: Clock,
    title: "25 Years of Proven Excellence",
    desc: "Since 1999, we have been the trusted name families return to — generation after generation. Our enduring legacy is not built on advertisement but on the quiet confidence of satisfied customers who send their children back to us.",
  },
  {
    icon: ShieldCheck,
    title: "Absolute Purity, Zero Compromise",
    desc: "Every ornament at Sri Velmayil carries the BIS 916 Hallmark and a unique HUID laser stamp — government-registered proof of purity. We don't just promise 22K gold; we can prove it, legally and scientifically.",
  },
  {
    icon: Scale,
    title: "Radically Transparent Pricing",
    desc: "Our billing separates gold value, stone charges, making charges, and GST into individual line items. You pay exactly what you should — not a rupee more. No ambiguity, no pressure, no regret.",
  },
  {
    icon: Gem,
    title: "Master Artisan Craftsmanship",
    desc: "From intricate Kodi Maalai necklaces to contemporary solitaire rings, our artisans blend 500-year-old Tamil goldsmithing traditions with modern precision. Each piece is hand-finished, inspected, and stamped before it reaches you.",
  },
  {
    icon: Headphones,
    title: "Expert Bridal Consultation",
    desc: "Your wedding jewellery is a once-in-a-lifetime decision. Our experienced consultants provide private, unhurried guidance — from selecting the right set to customising weight, design, and finish to match your vision perfectly.",
  },
  {
    icon: Star,
    title: "Fair Old Gold Exchange",
    desc: "When it is time to refresh your collection, we offer honest, live-rate-based buyback and exchange for your old jewellery. You receive the true market value — calculated transparently, paid with dignity.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 relative overflow-hidden">

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/25 mb-6">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Trusted Since 1999 · Tirupur's Finest</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          The Art of Earning Trust,<br className="hidden sm:block" /> One Ornament at a Time
        </h1>
        <p className="mt-5 text-base sm:text-lg text-[#F3E5AB]/70 max-w-2xl mx-auto font-sans leading-relaxed">
          For a quarter century, Sri Velmayil Jewellery has stood at the intersection of heritage craftsmanship and honest commerce — turning precious metal into priceless memories.
        </p>
      </div>

      {/* About Paragraphs + Highlight Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-7">
            <h2 className="font-serif text-3xl font-bold text-white">Our Heritage & Story</h2>

            <p className="text-[#F3E5AB]/78 text-sm sm:text-base leading-relaxed font-sans">
              Sri Velmayil Jewellery was founded in 1999 with a single, unshakeable conviction: that every customer deserves pure gold, fairly priced, and beautifully crafted. Over the past 25 years, we have grown from a neighbourhood jeweller in Tirupur into one of Tamil Nadu's most respected gold destinations — not through grand promises, but through thousands of quiet moments of trust honoured across every transaction, every consultation, and every masterfully crafted ornament.
            </p>

            <p className="text-[#F3E5AB]/78 text-sm sm:text-base leading-relaxed font-sans">
              Our master artisans are custodians of a craft refined over centuries. They breathe life into gold through traditional Tamil techniques — the delicate filigree of a Kodi Maalai, the commanding presence of a temple-inspired necklace, the quiet elegance of a modern kada. Whether you seek a heavy bridal ensemble that anchors a family moment, or a lightweight daily-wear piece that moves with your life, our craftsmen bring the same unyielding attention to detail to every creation.
            </p>

            <p className="text-[#F3E5AB]/78 text-sm sm:text-base leading-relaxed font-sans">
              Trust, for us, is not a marketing slogan — it is the foundation of every relationship we build. Thousands of Tirupur families have entrusted us with their daughters' wedding jewellery, their first gold purchase, their anniversary gifts, and their investment decisions. We are proud to carry that responsibility with the gravity it deserves. When you walk into Sri Velmayil, you walk into 25 years of kept promises.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "100% BIS 916 Hallmarked gold — verified by the Government of India",
                "HUID laser-stamped for traceability and authenticity",
                "Transparent billing: gold value, making charges, and GST itemised separately",
                "Expert private consultation for custom bridal and ceremonial jewellery",
                "Fair old gold exchange at live market rates — no deductions, no drama",
              ].map((point, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm text-[#F3E5AB]/82 font-sans">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 content-start">
            {[
              { icon: ShieldCheck, title: "Purity Guaranteed", desc: "Every gram of gold sold carries the BIS 916 hallmark and HUID stamp — government-verified, uncompromisingly pure." },
              { icon: Award, title: "Master Crafted", desc: "Artisans with decades of experience who craft traditional and contemporary designs with equal finesse." },
              { icon: Heart, title: "Customer First, Always", desc: "Transparent pricing, honest advice, and zero pressure — because lasting relationships matter more than a single sale." },
              { icon: Users, title: "A Legacy of Families", desc: "Grandmothers, mothers, and daughters — three generations of Tirupur families trust us with their most precious moments." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 flex flex-col items-center text-center space-y-3 hover:border-[#D4AF37]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">{title}</h3>
                <p className="text-xs text-[#F3E5AB]/65 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-4">
              Why Discerning Families Choose Us
            </h2>
            <p className="text-[#F3E5AB]/65 text-sm sm:text-base font-sans max-w-2xl mx-auto">
              In a world of choices, six reasons why Sri Velmayil Jewellery remains the only choice for those who refuse to compromise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-8 hover:border-[#D4AF37]/40 hover:bg-[#1a0b2e]/60 transition-all duration-300 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{title}</h3>
                <p className="text-sm text-[#F3E5AB]/68 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Trust */}
        <div className="mb-24 bg-gradient-to-br from-[#1a0b2e]/60 to-[#0c0418]/80 border border-[#D4AF37]/20 rounded-3xl p-10 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6 max-w-3xl mx-auto">
            The Quiet Confidence of a Promise Kept — 25 Years Running
          </h2>
          <p className="text-[#F3E5AB]/75 text-sm sm:text-base font-sans leading-relaxed max-w-3xl mx-auto">
            At Sri Velmayil Jewellery, quality is not a department — it is a culture that permeates every decision we make. Every ornament leaves our showroom only after passing rigorous purity testing, hallmarking, and quality inspection. Our pricing is published openly, calculated transparently, and never negotiated in shadows. Generations of happy families — from first-time buyers purchasing a simple chain to matriarchs commissioning elaborate wedding sets — have found in us a jeweller who values their trust above all profit. When you invest in gold here, you invest in a relationship built on integrity, a craft refined over decades, and a guarantee that the ornament you hold today will be worth every rupee you paid — and more.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#1a0b2e]/30 border border-[#D4AF37]/10 p-10 rounded-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
            Begin Your Jewellery Journey With Us
          </h2>
          <p className="text-sm text-[#F3E5AB]/65 font-sans mb-6 max-w-lg mx-auto">
            Visit our showroom in Tirupur or explore our collections online. Experience the Sri Velmayil difference — where every ornament carries a legacy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jewellery-collections"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg hover:brightness-110 transition-all"
            >
              View Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
