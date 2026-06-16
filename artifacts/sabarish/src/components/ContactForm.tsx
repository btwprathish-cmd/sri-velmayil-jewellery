import React, { useState } from "react";
import { Send } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/utils/brand";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi ${BRAND.name},\n\nName: ${name}\nPhone: ${phone}\n\nInquiry: ${message}`;
    window.open(getWhatsAppUrl(text), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
            placeholder="Enter your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">Phone Number</label>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
            placeholder="Enter phone number" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#F3E5AB]/75 uppercase tracking-wider mb-2">Message / Inquiry Details</label>
        <textarea rows={4} required value={message} onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#1a0b2e] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
          placeholder="Describe what you are looking for..." />
      </div>
      <button type="submit"
        className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg shadow-lg hover:brightness-110 transition-all">
        <span>Send via WhatsApp</span>
        <Send className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}
