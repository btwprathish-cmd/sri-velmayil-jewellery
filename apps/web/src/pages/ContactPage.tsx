import React from "react";
import { Helmet } from "react-helmet";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, Phone, Clock, Mail, Users } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>
          Contact Sri Velmayil Jewellery Tirupur | Jewellery Shop Contact
        </title>

        <meta
          name="description"
          content="Contact Sri Velmayil Jewellery in Tirupur. Visit our showroom, call us, message on WhatsApp or send an enquiry online."
        />

        <meta
          name="keywords"
          content="Contact Jewellery Shop Tirupur, Sri Velmayil Jewellery Contact, Gold Shop Tirupur Contact, Jewellery Showroom Tirupur"
        />

        <link
          rel="canonical"
          href="https://srivelmayiljewellery.store/contact-us"
        />

        <meta
          property="og:title"
          content="Contact Sri Velmayil Jewellery Tirupur"
        />

        <meta
          property="og:description"
          content="Get in touch with Sri Velmayil Jewellery for jewellery enquiries, gold rates and showroom visits."
        />

        <meta
          property="og:url"
          content="https://srivelmayiljewellery.store/contact-us"
        />

        <meta property="og:type" content="website" />
      </Helmet>
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

      {/* WhatsApp Group Banner */}
      <div className="relative mb-16 rounded-2xl overflow-hidden border border-[#25D366]/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b1a] via-[#0c1f15] to-[#081410]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(37,211,102,0.4) 0%, transparent 55%), radial-gradient(circle at 80% 50%, rgba(37,211,102,0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/15 border-2 border-[#25D366]/40 flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#25D366] uppercase tracking-widest mb-1 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> WhatsApp Group
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                Join Our Exclusive Updates Group
              </h2>
              <p className="text-sm text-white/65 font-sans mt-1 max-w-md leading-relaxed">
                Get daily gold rate updates, new arrivals, festive offers, and bridal collection previews — directly on WhatsApp.
              </p>
            </div>
          </div>
          <a
            href={BRAND.whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold rounded-xl transition-all shadow-lg text-sm uppercase tracking-wider whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join WhatsApp Group
          </a>
        </div>
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
    </>
  );
}
