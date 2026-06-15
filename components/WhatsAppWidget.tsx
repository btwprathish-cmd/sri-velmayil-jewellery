"use client";

import { MessageCircle } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";

export default function WhatsAppWidget() {
  const message = `Hi, I visited the Sri Velmayil Jewellery website. I would like to know more about your gold jewellery collections in Tirupur.`;

  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Sri Velmayil Jewellery on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-3 rounded-full shadow-2xl shadow-[#25D366]/30 hover:scale-105 transition-all duration-300 group"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="text-sm font-bold hidden sm:inline group-hover:inline">WhatsApp</span>
      <span className="sr-only">Contact {BRAND.name} at {BRAND.phone}</span>
    </a>
  );
}
