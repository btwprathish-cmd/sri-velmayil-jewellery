import React from "react";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: "Contact Us", href: "/contact-us" }]} />
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          Contact Our Showroom
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
          Have an inquiry about wedding gold designs or custom weights? Reach out to us or visit our Tirupur showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5 space-y-8">
          {[
            { icon: MapPin, title: "Showroom Address", content: BRAND.fullAddress },
            { icon: Phone, title: "Phone / WhatsApp", content: `+91 ${BRAND.phone}`, href: `tel:+91${BRAND.phone}` },
            { icon: Clock, title: "Business Hours", content: "Monday - Sunday: 9:30 AM - 9:00 PM" },
            { icon: Mail, title: "Email", content: BRAND.email, href: `mailto:${BRAND.email}` },
          ].map(({ icon: Icon, title, content, href }) => (
            <div key={title} className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <Icon className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-bold text-white font-sans uppercase text-xs tracking-wider mb-1">{title}</h3>
                {href ? (
                  <a href={href} className="text-sm text-[#F3E5AB]/75 hover:text-[#D4AF37] font-sans">{content}</a>
                ) : (
                  <p className="text-sm text-[#F3E5AB]/75 font-sans">{content}</p>
                )}
              </div>
            </div>
          ))}

          <a
            href={getWhatsAppUrl("Hi Sri Velmayil Jewellery, I would like to enquire about your gold jewellery.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold rounded-xl transition-all shadow-lg"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 mb-8">
            <h2 className="font-serif text-xl font-bold text-[#F3E5AB] mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          <div className="h-72 w-full rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-2xl">
            <iframe
              title="Sri Velmayil Jewellery Map"
              src="https://maps.google.com/maps?q=Sri%20Velmayil%20Jewellery%2089%20New%20Market%20Street%20Tirupur%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
