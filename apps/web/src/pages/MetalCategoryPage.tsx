import React, { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Award, HelpCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryButtons from "@/components/EnquiryButtons";
import { getCollections, type CollectionItem } from "@/utils/collections";
import { fetchLatestRate, type LiveRateRecord } from "@/utils/rates";

const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860,
  gold22k_8g: 110880,
  silver_1g: 270,
  gold24k_1g: 15131,
  source: "fallback",
  fetchedAt: new Date().toISOString(),
};

const productImages: Record<string, string> = {
  "antique-peacock-necklace": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500",
  "classic-choker-necklace": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=500",
  "bridal-haram-necklace": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=500",
  "kangan-bangles": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500",
  "rope-design-bangles": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500",
  "flower-filigree-ring": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=500",
  "gents-signet-ring": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=500",
};

export default function MetalCategoryPage() {
  const [, params] = useRoute("/jewellery-collections/:metal/:category");
  const metal = params?.metal ?? "";
  const category = params?.category ?? "";
  const [latestRate, setLatestRate] = useState<LiveRateRecord>(FALLBACK_RATE);
  const [collections, setCollections] = useState(() => getCollections());

  useEffect(() => {
    fetchLatestRate()
      .then(setLatestRate)
      .catch(() => {});
    // Force hydration of local storage collections on mount
    setCollections(getCollections());
  }, []);

  const metalLabel = metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase();
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const matchingCollections = collections.filter(
    (c) =>
      c.metal.toLowerCase() === metal.toLowerCase() &&
      c.category.toLowerCase() === category.toLowerCase()
  );

  const allItems: CollectionItem[] = matchingCollections.flatMap((c) => c.items);
  const goldRate22k = latestRate.gold22k_1g;

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

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Collections", href: "/jewellery-collections" },
          { name: `${metalLabel} Collections`, href: `/jewellery-collections/${metal}` },
          {
            name: categoryLabel,
            href: `/jewellery-collections/${metal}/${category}`,
          },
        ]}
      />

      <div className="text-center md:text-left border-b border-[#D4AF37]/20 pb-8 mb-12">
        <h1 className="font-serif text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          {metalLabel} {categoryLabel}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/75 font-sans leading-relaxed max-w-3xl">
          All {categoryLabel.toLowerCase()} ornaments are crafted in {metalLabel.toLowerCase() === "gold" ? "22K gold" : "99.9% fine silver"}, stamped with the BIS logo, and carry a unique HUID.
        </p>
      </div>

      {allItems.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
            <Award className="h-8 w-8 text-[#D4AF37]/50" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#F3E5AB]/60 mb-2">
            No {categoryLabel} available in {metalLabel} collection yet.
          </h2>
          <p className="text-sm text-[#F3E5AB]/40 mb-6">
            New designs are added regularly. Check back soon or explore another category.
          </p>
          <Link
            href={`/jewellery-collections/${metal}`}
            className="inline-flex items-center px-6 py-2.5 border border-[#D4AF37]/30 text-sm font-semibold rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
          >
            ← Back to {metalLabel} Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allItems.map((item) => {
            const isSilver = metalLabel.toLowerCase() === "silver";
            const baseRate = isSilver ? latestRate.silver_1g : latestRate.gold22k_1g;
            const metalValue = item.weight_g * baseRate;
            const makingCharges = metalValue * (item.making_charge_pct / 100);
            const taxable = metalValue + makingCharges;
            const gst = taxable * 0.03;
            const totalPrice = Math.round(taxable + gst);

            return (
              <div
                key={item.id}
                className="bg-[#1a0b2e]/55 border border-[#D4AF37]/15 rounded-2xl overflow-hidden hover:border-[#D4AF37]/35 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-900">
                  <img
                    src={productImages[item.id] || item.image}
                    alt={`${item.name} - ${metalLabel} Jewellery at Sri Velmayil Jewellery Tirupur`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 bg-[#1a0b2e] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.weight_g} Grams
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-serif text-lg font-bold text-[#F3E5AB]">{item.name}</h2>
                    <p className="text-xs text-[#F3E5AB]/65 font-sans leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#D4AF37]/10 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#F3E5AB]/50 font-bold uppercase tracking-wider">Live Price Est.</span>
                      <span className="text-xl font-bold text-[#D4AF37] font-mono">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="bg-[#0c0418]/60 p-3 rounded-lg border border-[#D4AF37]/10 text-[11px] text-[#F3E5AB]/60 font-sans space-y-1.5">
                      <div className="flex justify-between">
                        <span>{isSilver ? "Silver" : "Gold"} Value:</span>
                        <span>₹{Math.round(metalValue).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Making ({item.making_charge_pct}%):</span>
                        <span>₹{Math.round(makingCharges).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (3%):</span>
                        <span>₹{Math.round(gst).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#F3E5AB]/40 italic flex items-center leading-relaxed">
                      <HelpCircle className="h-3.5 w-3.5 text-[#D4AF37]/65 mr-1.5 flex-shrink-0" />
                      Based on ₹{baseRate.toLocaleString("en-IN")}/g board rate.
                    </p>
                  </div>
                  <EnquiryButtons productName={item.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-[#110522] to-[#1a0b2e] border border-[#D4AF37]/20 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4 mb-6 md:mb-0">
          <Award className="h-12 w-12 text-[#D4AF37] flex-shrink-0" />
          <div>
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              100% BIS Hallmarked Purity Guarantee
            </h3>
            <p className="text-xs text-[#F3E5AB]/65 font-sans mt-0.5 max-w-xl">
              Every ornament carries the BIS triangular logo alongside a unique HUID stamp.
            </p>
          </div>
        </div>
        <Link
          href="/faq"
          className="px-6 py-2.5 border border-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
        >
          Learn about HUID
        </Link>
      </div>
    </div>
  );
}
