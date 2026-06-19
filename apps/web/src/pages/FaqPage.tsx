import React from "react";
import FAQ from "@/components/FAQ";

export default function FaqPage() {
  return (
    <div className="py-8 sm:py-16">
      <div className="text-center pt-8 pb-4 px-4">
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 font-sans">
          Have questions about gold purity, HUID markings, pricing, or custom designs?
        </p>
      </div>
      <FAQ showCTA={true} />
    </div>
  );
}
