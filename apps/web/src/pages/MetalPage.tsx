import React, { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Award, Gem, Link2, Star, Circle, Shield, ArrowLeft, type LucideIcon } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getCategories, getMetals } from "@/utils/collections";
const DEFAULT_CATEGORY_INFO: Record<string, { description: string; icon: LucideIcon }> = {
  "coin": {
    description: "Pure gold and silver coins in various weights — ideal for gifting and investment.",
    icon: Award,
  },
  "ring": {
    description: "Engagement, wedding, and daily-wear rings in traditional and modern styles.",
    icon: Gem,
  },
  "chain": {
    description: "Necklaces and chains — from delicate daily wear to heavy bridal harems.",
    icon: Link2,
  },
  "earring": {
    description: "Studs, drops, jhumkas, and chandbalis crafted in 22K hallmarked gold.",
    icon: Star,
  },
  "bracelet": {
    description: "Bangles and bracelets ranging from lightweight daily pieces to grand bridal sets.",
    icon: Circle,
  },
  "anklet": {
    description: "Traditional and contemporary anklets in pure gold and silver.",
    icon: Shield,
  },
};

export default function MetalPage() {
  const [, params] = useRoute("/jewellery-collections/:metal");
  const metal = params?.metal ?? "";
  const metalLabel = metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase();

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [metalInfo, setMetalInfo] = useState<any>(null);

  useEffect(() => {
    getMetals().then(allMetals => {
      const found = allMetals.find(m => m.name.toLowerCase() === metal.toLowerCase());
      setMetalInfo(found || { name: metalLabel });
    });

    getCategories().then(allCats => {
      const filteredCats = allCats.filter(cat => 
        !cat.metals || cat.metals.length === 0 || cat.metals.some((m: string) => m.toLowerCase() === metalLabel.toLowerCase())
      );
      setCategoriesList(filteredCats);
    });
  }, [metal, metalLabel]);

  if (!metal) {
    return (
      <div className="py-32 text-center">
        <p className="text-[#F3E5AB]/60 mb-4">Collection not found.</p>
        <Link href="/jewellery-collections" className="text-[#D4AF37] hover:underline">
          ← View All Collections
        </Link>
      </div>
    );
  }

  const isGold = metal.toLowerCase() === "gold";
  const isSilver = metal.toLowerCase() === "silver";

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Collections", href: "/jewellery-collections" },
          { name: `${metalLabel} Collections`, href: `/jewellery-collections/${metal}` },
        ]}
      />

      {/* Dynamic Hero image */}
      {metalInfo && (
        <div className="relative w-full rounded-2xl overflow-hidden mb-14 shadow-2xl border border-[#D4AF37]/25">
          <img
            src={metalInfo.imageUrl || (isGold ? "/images/gold-collection-hero.jpeg" : isSilver ? "/images/silver-collection-hero.jpeg" : "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200")}
            alt={`${metalInfo.name} Jewellery Collection — Sri Velmayil Jewellery Tirupur`}
            className="w-full object-cover object-center"
            style={{ maxHeight: "520px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">
              {metalInfo.purityLabel || (isGold ? "BIS 916 Hallmarked" : isSilver ? "Purity 99.9%" : "Exclusive")}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
              {metalInfo.name} Collections
            </h1>
            <p className="text-sm sm:text-base text-[#F3E5AB]/80 font-sans mt-1">
              {metalInfo.description || (isGold ? "Timeless elegance — crafted in pure 22K gold." : isSilver ? "Pure. Stylish. Forever." : `Discover our exquisite ${metalInfo.name} collection.`)}
            </p>
          </div>
        </div>
      )}

      <div className={
        categoriesList.length === 1 ? "grid grid-cols-1 max-w-sm mx-auto gap-6" :
        categoriesList.length === 2 ? "grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6" :
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {categoriesList.map((category) => {
          const categoryName = category.name;
          const id = categoryName.toLowerCase();
          const info = DEFAULT_CATEGORY_INFO[id] || {
            description: `Explore our beautiful collection of ${metalLabel} ${categoryName}s.`,
            icon: Circle,
          };
          
          const description = category.description || info.description;
          const Icon = info.icon;
          
          return (
            <Link
              key={id}
              href={`/jewellery-collections/${metal}/${id}`}
              className="group bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/45 hover:bg-[#1a0b2e]/60 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="flex flex-col space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/15 transition-colors">
                  <Icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#F3E5AB] group-hover:text-[#D4AF37] transition-colors">
                    {categoryName}
                  </h2>
                  <p className="text-sm text-[#F3E5AB]/60 leading-relaxed font-sans mt-2">{description}</p>
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-[#D4AF37]/10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4AF37]/70 uppercase tracking-wider">Browse Designs</span>
                <ArrowLeft className="h-4 w-4 text-[#D4AF37]/60 group-hover:text-[#D4AF37] rotate-180 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
