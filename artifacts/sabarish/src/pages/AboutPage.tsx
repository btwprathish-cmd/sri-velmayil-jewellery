import React from "react";
import { Link } from "wouter";
import { Award, ShieldCheck, Heart, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          About Sri Velmayil Jewellery
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
          Serving Tirupur with purity, honesty, and master craftsmanship.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-white">Our Heritage & Story</h2>
            <p className="text-[#F3E5AB]/75 text-sm sm:text-base leading-relaxed font-sans">
              Sri Velmayil Jewellery has been a cornerstone of trust and craftsmanship in Tirupur's jewellery market for generations. Founded with a commitment to providing 100% pure, BIS-hallmarked gold jewellery, we have grown to become one of Tirupur's most respected jewellery destinations.
            </p>
            <p className="text-[#F3E5AB]/75 text-sm sm:text-base leading-relaxed font-sans">
              Our skilled artisans blend traditional Tamil jewellery-making techniques with contemporary designs, creating pieces that honor our cultural heritage while meeting modern aesthetic sensibilities. Every ornament we craft tells a story of precision and pride.
            </p>
            <div className="space-y-3">
              {[
                "100% BIS 916 Hallmarked gold on every item",
                "Transparent pricing with separate making charges",
                "Expert consultation for custom wedding jewellery",
                "Fair old gold exchange based on live market rates",
                "HUID registered for government verification",
              ].map((point, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm text-[#F3E5AB]/80 font-sans">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: ShieldCheck, title: "Purity Guarantee", desc: "Every gram of gold sold carries the BIS 916 hallmark and HUID stamp." },
              { icon: Award, title: "Master Crafted", desc: "Artisans with decades of experience creating traditional and modern designs." },
              { icon: Heart, title: "Customer First", desc: "Transparent pricing and honest advice for every customer, every time." },
              { icon: Users, title: "Family Legacy", desc: "A family jewellery store trusted by generations of Tirupur families." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 flex flex-col items-center text-center space-y-3 hover:border-[#D4AF37]/35 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">{title}</h3>
                <p className="text-xs text-[#F3E5AB]/65 leading-relaxed font-sans">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-[#1a0b2e]/30 border border-[#D4AF37]/10 p-10 rounded-2xl">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Jewellery?</h2>
          <p className="text-sm text-[#F3E5AB]/65 font-sans mb-6 max-w-lg mx-auto">
            Visit our showroom in Tirupur or explore our collections online. Our consultants are here to help you find the perfect piece.
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
