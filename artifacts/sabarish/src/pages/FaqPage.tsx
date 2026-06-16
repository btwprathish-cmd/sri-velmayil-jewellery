import React from "react";

const faqs = [
  {
    question: "Are all gold products at Sri Velmayil Jewellery BIS 916 hallmarked?",
    answer: "Yes, absolutely. Every single piece of gold jewellery crafted and sold at Sri Velmayil Jewellery is 100% BIS 916 Hallmarked. They carry the official Bureau of Indian Standards (BIS) logo, the purity stamp (22K916), and the unique 6-digit alphanumeric HUID laser code.",
  },
  {
    question: "How do I verify the HUID code of my jewellery?",
    answer: "You can easily verify the authenticity of your purchase using the government's official 'BIS CARE' mobile app. Download the app, navigate to the 'Verify HUID' section, and enter the 6-digit alphanumeric code engraved on your ornament.",
  },
  {
    question: "How is the daily gold rate determined in Tirupur?",
    answer: "The daily gold rate in Tirupur is updated based on regional benchmarks set by the Madras Jewellers & Diamond Merchants Association (MJDMA). These benchmarks are influenced by international market rates (LBMA), currency exchange rates (USD-INR), import duties, and local supply-demand variables.",
  },
  {
    question: "Do you offer custom jewellery designing services?",
    answer: "Yes, we specialize in custom-designed jewellery. Our master craftsmen will work closely with you to create your dream bridal harams, necklaces, bangles, or rings. Custom orders typically take 10 to 20 days depending on complexity.",
  },
  {
    question: "What are the payment options accepted at your showroom?",
    answer: "We accept all major payment methods including Cash, Debit/Credit Cards, UPI payments (GPay, PhonePe, Paytm), Net Banking, and Gold exchange schemes.",
  },
  {
    question: "Can I exchange my old gold jewellery at your store?",
    answer: "Yes, you can exchange your old gold jewellery. We use precision testing methods to determine the exact purity and weight of your old gold and offer the maximum market trade-in value based on that day's live gold rate.",
  },
];

export default function FaqPage() {
  return (
    <div className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 font-sans">
          Have questions about gold purity, HUID markings, pricing, or custom designs?
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-all duration-200">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F3E5AB] mb-3">{faq.question}</h3>
            <p className="text-sm text-[#F3E5AB]/75 leading-relaxed font-sans">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-[#1a0b2e]/20 border border-[#D4AF37]/10 p-8 rounded-2xl">
        <h3 className="font-serif text-xl font-bold text-white mb-2">Still have questions?</h3>
        <p className="text-xs text-[#F3E5AB]/60 font-sans mb-4">Reach out to our showroom consultants directly via call.</p>
        <a href="tel:+919443476183"
          className="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-sm hover:brightness-110 shadow-md transition-all"
        >
          Call Us: +91 9443476183
        </a>
      </div>
    </div>
  );
}
