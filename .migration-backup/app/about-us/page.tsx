import React from "react";
import Link from "next/link";
import { Award, ShieldCheck, Heart, Users, CheckCircle, ArrowRight } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import { getSeoMetadata } from "@/utils/seo";

export const metadata = getSeoMetadata({
  title: "About Us | Trusted Jewellery Shop in Tirupur",
  description: "Learn about the heritage, values, and quality assurance of Sri Velmayil Jewellery, Tirupur's preferred destination for BIS 916 gold ornaments.",
  path: "/about-us"
});

export default function AboutPage() {
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "About Us", item: "https://srivelmayiljewellery.com/about-us" }
  ]);

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 relative overflow-hidden">
        {/* Banner/Title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            About Sri Velmayil Jewellery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
            Serving Tirupur with purity, honesty, and master craftsmanship.
          </p>
        </div>

        {/* Content sections */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Legacy section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold text-white">Our Legacy of Purity</h2>
              <p className="text-[#F3E5AB]/75 text-sm sm:text-base leading-relaxed font-sans">
                Sri Velmayil Jewellery was founded in Tirupur, Tamil Nadu, with a single vision: to provide our community with the highest quality gold ornaments and investments with absolute transparency. Over the years, we have built a reputation as one of the most trusted family-owned jewellery showrooms in the region.
              </p>
              <p className="text-[#F3E5AB]/75 text-sm sm:text-base leading-relaxed font-sans">
                Every piece of jewellery we sell is a testament to our dedication. We blend traditional Tamil Nadu goldsmithing heritage with contemporary designs to suit every celebration, from small personal milestones to grand weddings.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
                alt="Inside Sri Velmayil Jewellery Tirupur Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1a0b2e]/30"></div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="bg-[#1a0b2e]/50 border border-[#D4AF37]/15 rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                Our Core Values
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/35 shadow-inner">
                  <Award className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Purity Guaranteed</h3>
                <p className="text-xs text-[#F3E5AB]/65 leading-relaxed font-sans">
                  We never compromise on metal quality. All our items are 100% BIS Hallmarked 916 gold. We encourage customers to verify HUIDs in-store.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/35 shadow-inner">
                  <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Fair Pricing</h3>
                <p className="text-xs text-[#F3E5AB]/65 leading-relaxed font-sans">
                  No hidden margins. We offer clear invoices separating the current daily board rate, manufacturing making charges, and GST.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/35 shadow-inner">
                  <Heart className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Customer Care</h3>
                <p className="text-xs text-[#F3E5AB]/65 leading-relaxed font-sans">
                  We treat every visitor like a member of our own family, helping you make the best financial decisions for your gold savings.
                </p>
              </div>
            </div>
          </div>

          {/* Hallmarking standards details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-8">
            <div className="order-2 md:order-1 relative h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800"
                alt="Gold purity testing and hallmarking standard verification"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1a0b2e]/30"></div>
            </div>
            
            <div className="order-1 md:order-2 space-y-5">
              <h2 className="font-serif text-3xl font-bold text-white">Why BIS 916 & HUID Matters?</h2>
              <p className="text-[#F3E5AB]/75 text-sm sm:text-base leading-relaxed font-sans">
                At Sri Velmayil Jewellery, we believe that education is protection. When purchasing gold in Tirupur, always check for the mandatory hallmarking stamps:
              </p>
              
              <ul className="space-y-3 font-sans text-sm text-[#F3E5AB]/70">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>The BIS Triangle Logo:</strong> Official mark of the Bureau of Indian Standards.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>22K916 Stamp:</strong> Verifies that the item contains exactly 91.6% pure gold.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>6-Digit Alphanumeric HUID:</strong> Unique ID for trace-checking on the government BIS Care app.</span>
                </li>
              </ul>
              
              <div className="pt-2">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center text-sm font-bold text-[#D4AF37] hover:underline"
                >
                  Have questions? Contact our experts <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
