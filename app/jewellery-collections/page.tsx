import React from "react";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import collectionsData from "@/data/collections.json";
import { getSeoMetadata } from "@/utils/seo";

export const metadata = getSeoMetadata({
  title: "Jewellery Collections | Sri Velmayil Jewellery Tirupur",
  description: "Browse our hand-crafted collections of gold necklaces, harams, bangles, and rings at Sri Velmayil Jewellery in Tirupur. All ornaments are BIS 916 hallmarked.",
  path: "/jewellery-collections"
});

export default function CollectionsPage() {
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Jewellery Collections", item: "https://srivelmayiljewellery.com/jewellery-collections" }
  ]);

  // Map slugs to Unsplash image fallback if data images aren't present
  const categoryImages: Record<string, string> = {
    "gold-necklaces": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    "gold-bangles": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    "gold-rings": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600"
  };

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 mb-4">
            <Award className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
              BIS 916 Hallmarked Gold
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Our Jewellery Collections
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-2xl mx-auto font-sans">
            Explore our curated, hand-crafted gold designs. From light-weight daily wear items to heavy traditional Tamil bridal ornaments, find the perfect piece.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collectionsData.map((category) => (
            <div
              key={category.id}
              className="group bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl overflow-hidden hover:border-[#D4AF37]/45 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={categoryImages[category.slug]}
                  alt={`${category.name} Collection at Sri Velmayil Jewellery Tirupur`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent opacity-85"></div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#F3E5AB]">{category.name}</h2>
                  <p className="text-sm text-[#F3E5AB]/65 leading-relaxed font-sans mt-2">
                    {category.description}
                  </p>
                  <p className="text-xs text-[#D4AF37]/80 font-bold uppercase tracking-wider mt-3">
                    Available Items: {category.items.length} designs
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/10">
                  <Link
                    href={`/jewellery-collections/${category.slug}`}
                    className="w-full inline-flex items-center justify-between py-2.5 px-4 border border-[#D4AF37]/30 text-sm font-semibold rounded-lg text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a0b2e] transition-colors"
                  >
                    <span>Browse Designs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
