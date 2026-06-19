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
  whatsappGroup: "https://chat.whatsapp.com/ISZBgnY7I0E1eWVrbHBxHQ",
  hallmark: "916 BIS HUID",
} as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}
