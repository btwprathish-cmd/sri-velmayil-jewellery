export const BRAND = {
  name: "Sri Velmayil Jewellery",
  shortName: "Sri Velmayil",
  location: "Tirupur",
  phone: "9443476183",
  phoneE164: "+919443476183",
  address: "89 New Market Street, Tirupur",
  fullAddress: "89 New Market Street, Tirupur, Tamil Nadu 641604",
  email: "info@srivelmayiljewellery.com",
  whatsapp: "919443476183",
  logo: "/images/sri-velmayil-jewellery-logo-tirupur.svg",
  logoPng: "/images/sri-velmayil-jewellery-logo-tirupur.png",
  hallmark: "916 BIS HUID",
} as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getEnquiryMessage(productName?: string, intent: "enquire" | "purchase" = "enquire"): string {
  const prefix =
    intent === "purchase"
      ? "Hi, I plan to purchase"
      : "Hi, I would like to enquire about";
  if (productName) {
    return `${prefix} the ${productName} from Sri Velmayil Jewellery Tirupur. Please share details.`;
  }
  return `${prefix} your jewellery collection at Sri Velmayil Jewellery Tirupur.`;
}
