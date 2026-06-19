import React from "react";
import { Link } from "wouter";
import { Phone, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";

const tagline = "Where every ornament carries a legacy and every gram holds a promise.";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#110522] border-t border-[#D4AF37]/20 text-[#F3E5AB]/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
              Sri Velmayil Jewellery
            </h3>
            <p className="text-sm text-[#F3E5AB]/60 font-sans italic leading-relaxed">
              "{tagline}"
            </p>
            <p className="text-xs text-[#F3E5AB]/45 font-sans">
              Tirupur's most trusted gold jeweller since 1999. 25 years of BIS 916 Hallmarked purity, master craftsmanship, and transparent pricing — serving generations of proud families.
            </p>
            <div className="pt-2 space-y-3 text-sm">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" />
                <span className="font-sans leading-relaxed">
                  <strong>Sri Velmayil Jewellery</strong><br />
                  89 New Market Street,<br />
                  Tirupur, Tamil Nadu, 641604
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                <a href="tel:+919443476183" className="hover:text-[#D4AF37] hover:underline font-sans">
                  +91 9443476183
                </a>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                <span className="font-sans">Open Daily: 9:30 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-6 uppercase tracking-wider">Useful Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/gold-rate-today-tirupur", label: "Today's Gold Rate" },
                { href: "/gold-rate-history", label: "Gold Rate History" },
                { href: "/jewellery-collections", label: "Jewellery Collections" },
                { href: "/blog", label: "Jewellery Blog" },
                { href: "/faq", label: "Frequently Asked Questions" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#D4AF37] hover:translate-x-1 inline-flex items-center transition-all duration-200">
                    <ArrowRight className="h-3 w-3 mr-2" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-4 uppercase tracking-wider">Our Guarantee</h4>
              <div className="flex items-center space-x-3 bg-[#1a0b2e] p-3 rounded-lg border border-[#D4AF37]/10">
                <ShieldCheck className="h-8 w-8 text-[#D4AF37] flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white uppercase">BIS 916 Hallmarked</p>
                  <p className="text-[#F3E5AB]/60">Every ornament carries the Government-approved HUID laser stamp — legally verified, eternally trustworthy.</p>
                </div>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Sri+Velmayil+Jewellery+89+New+Market+Street+Tirupur+Tamil+Nadu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center py-3 px-4 rounded-md bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-sm hover:brightness-110 shadow-lg transition-all duration-300"
            >
              Get Directions on Maps
            </a>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#D4AF37] mb-2 uppercase tracking-wider">Store Location</h4>
            <div className="h-44 w-full rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-md">
              <iframe
                title="Sri Velmayil Jewellery Location Tirupur"
                src="https://maps.google.com/maps?q=Sri%20Velmayil%20Jewellery%2089%20New%20Market%20Street%20Tirupur%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/15 pt-8 text-center">
          <p className="font-serif text-base italic text-[#D4AF37]/70 mb-3">
            "Crafted with devotion. Certified with honour. Worn with pride."
          </p>
          <p className="text-xs text-[#F3E5AB]/40">© {currentYear} Sri Velmayil Jewellery. All rights reserved.</p>
          <p className="mt-2 text-xs text-[#F3E5AB]/40">
            89 New Market Street, Tirupur, Tamil Nadu. Phone:{" "}
            <a href="tel:+919443476183" className="hover:text-[#D4AF37]">+91 9443476183</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
