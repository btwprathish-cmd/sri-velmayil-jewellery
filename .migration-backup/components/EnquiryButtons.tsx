import { MessageCircle, ShoppingBag } from "lucide-react";
import { getEnquiryMessage, getWhatsAppUrl } from "@/utils/brand";

interface EnquiryButtonsProps {
  productName: string;
  className?: string;
}

export default function EnquiryButtons({ productName, className = "" }: EnquiryButtonsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${className}`}>
      <a
        href={getWhatsAppUrl(getEnquiryMessage(productName, "enquire"))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center gap-2 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1a0b2e] border border-[#D4AF37]/35 font-bold text-xs rounded-lg uppercase tracking-wider transition-all"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Enquire Now
      </a>
      <a
        href={getWhatsAppUrl(getEnquiryMessage(productName, "purchase"))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center gap-2 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 text-[#1a0b2e] font-bold text-xs rounded-lg uppercase tracking-wider transition-all"
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Plan to Purchase
      </a>
    </div>
  );
}
