import React from "react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import { getSeoMetadata } from "@/utils/seo";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Contact Us | Sri Velmayil Jewellery Tirupur",
  description: "Get in touch with Sri Velmayil Jewellery in Tirupur. Find our address (89 New Market Street), phone number (+91 9443476183), operating hours, and map location.",
  path: "/contact-us"
});

export default function ContactPage() {
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Contact Us", item: "https://srivelmayiljewellery.com/contact-us" }
  ]);

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Contact Our Showroom
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
            Have an inquiry about wedding gold designs or custom weights? Reach out to us or visit our Tirupur showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Contact Details & NAP (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#1a0b2e]/55 border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <h2 className="font-serif text-2xl font-bold text-white border-b border-[#D4AF37]/10 pb-3 uppercase tracking-wider">
                Store Details
              </h2>
              
              <div className="space-y-5 text-sm sm:text-base">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-[#D4AF37] mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Our Address</h3>
                    <address className="not-italic text-[#F3E5AB]/70 leading-relaxed mt-1">
                      <strong>Sri Velmayil Jewellery</strong><br />
                      89 New Market Street,<br />
                      Tirupur, Tamil Nadu - 641604
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-[#D4AF37] mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Phone Number</h3>
                    <p className="text-[#F3E5AB]/70 mt-1">
                      <a href="tel:+919443476183" className="hover:text-[#D4AF37] hover:underline font-mono">
                        +91 9443476183
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-[#D4AF37] mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Opening Hours</h3>
                    <p className="text-[#F3E5AB]/70 mt-1">
                      Monday - Sunday: 9:30 AM - 9:00 PM<br />
                      <span className="text-xs text-[#D4AF37]">Open on all Sundays</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-[#D4AF37] mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white">Email Address</h3>
                    <p className="text-[#F3E5AB]/70 mt-1">
                      <a href="mailto:info@srivelmayiljewellery.com" className="hover:text-[#D4AF37] hover:underline">
                        info@srivelmayiljewellery.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/10 flex flex-col gap-3">
                <a
                  href="https://maps.google.com/?q=Sri+Velmayil+Jewellery+89+New+Market+Street+Tirupur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-sm hover:brightness-110 shadow-lg transition-all"
                >
                  Get Directions on Maps
                </a>
                <a
                  href="tel:+919443476183"
                  className="w-full flex justify-center items-center py-3 border border-[#D4AF37] rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 font-bold text-sm transition-all"
                >
                  Call Store Now
                </a>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1a0b2e]/30 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-6">
                Send An Inquiry
              </h2>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">
                    Message / Inquiry Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                    placeholder="Describe what you are looking for (e.g. Weight of bridal haram, making charges, custom necklace timeline)..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
                  >
                    <span>Send Message</span>
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Interactive Google Map */}
        <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl h-[450px]">
          <iframe
            title="Sri Velmayil Jewellery Location Map Tirupur"
            src="https://maps.google.com/maps?q=Sri%20Velmayil%20Jewellery%2089%20New%20Market%20Street%20Tirupur%20Tamil%20Nadu&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </>
  );
}
