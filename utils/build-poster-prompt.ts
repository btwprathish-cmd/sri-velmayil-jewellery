export interface PosterFormData {
  phone: string;
  address: string;
  date: string;
  gold1g: string;
  gold8g: string;
  silver1g: string;
}

export function buildPosterPrompt(data: PosterFormData): string {
  const themes = [
    "Emerald tropical leaves with deep black luxury background",
    "Royal maroon velvet with floating diamond particles",
    "South Indian temple architecture with ornate gold pillars",
    "Peacock-inspired royal blue luxury theme with feather motifs",
    "Premium black marble texture with fine gold vein accents",
    "Flowing golden silk fabric draped in studio light",
    "Royal Chettinad palace interior with arched corridors",
    "Lotus flower luxury arrangement on dark water surface",
    "Floating gold particles and cinematic bokeh background",
    "Traditional South Indian wedding mandap atmosphere",
    "Modern luxury jewellery photography studio setup",
    "Minimal deep black and gold luxury composition",
    "Royal amethyst purple premium velvet background",
    "Warm golden sandstone cave with dramatic lighting",
    "Luxury white floral arrangement with gold accents",
    "Dark emerald forest with golden ambient light",
    "Golden Mughal palace corridor with grand arches",
    "Premium spotlight stage with dramatic rim lighting",
    "Floating jewellery gallery suspended in dark luxury space",
    "Deep navy blue celestial luxury with gold constellations",
  ];

  const jewelleryTypes = [
    "South Indian Temple Necklace with deity motifs",
    "Antique Gold Haram with traditional granulation work",
    "Bridal Gold Necklace with emerald drops",
    "Kundan Necklace with polki and enamel work",
    "Polki Necklace with uncut diamond settings",
    "Victorian Gold Jewellery Set",
    "Diamond Necklace with brilliant cut stones",
    "Peacock Design Necklace with sapphire accents",
    "Ruby Emerald Jewellery Set with gold base",
    "Lakshmi Coin Necklace in 22K gold",
    "Designer Gold Ring with intricate filigree",
    "Luxury Gold Bangles with stone setting",
    "Bridal Choker with layered design",
    "Jhumka Earrings with chandelier drops",
    "Modern Designer Geometric Gold Jewellery",
    "Heritage Gold Collection with antique finish",
  ];

  const theme = themes[Math.floor(Math.random() * themes.length)];
  const jewellery = jewelleryTypes[Math.floor(Math.random() * jewelleryTypes.length)];

  return `Act as an expert luxury jewellery poster designer. Create a premium luxury vertical social media poster (1080x1920, 9:16 ratio) for a daily live gold rate update.

THEME: ${theme}
HERO JEWELLERY: ${jewellery} — hyper-realistic, commercial advertisement quality, ultra detailed, premium gold reflections, luxury studio photography lighting.

BRAND INFORMATION:
Phone: ${data.phone}
Address: ${data.address}
Date: ${data.date}
22K Gold 1 GM: ₹${data.gold1g}
22K Gold 8 GM: ₹${data.gold8g}
Silver 1 GM: ₹${data.silver1g}

EXPERT DESIGN REQUIREMENTS:
- DO NOT WRITE ANY COMPANY NAME. Leave an elegant empty space at the very top center for a logo overlay.
- The layout must be extremely professional, balanced, and aesthetically pleasing, exactly as crafted by a top-tier ad agency.
- The Date (${data.date}) should be placed elegantly near the top or seamlessly integrated into the layout.
- The Rate Cards (Gold 1GM ₹${data.gold1g}, Gold 8GM ₹${data.gold8g}, Silver 1GM ₹${data.silver1g}) must be prominent, highly readable, using gold metallic borders and luxury typography in the center or lower center.
- The Footer must beautifully display the Address (${data.address}) and Phone Number (${data.phone}) with appropriate icons at the very bottom.
- Incorporate a BIS Hallmark seal subtly but clearly.
- Unique layout — never generic or templated.

TYPOGRAPHY:
Headings: Elegant serif font, luxury jewellery advertisement style.
Supporting text: Clean modern sans-serif, professional spacing.

MANDATORY ELEMENTS (include all):
1. Empty space at the top
2. TODAY'S GOLD RATE heading
3. Live date: ${data.date}
4. 22K Gold 1GM rate
5. 22K Gold 8GM rate
6. Silver 1GM rate
7. Phone number: ${data.phone}
8. Address: ${data.address}
9. BIS Hallmark seal
10. Hero jewellery image

NEGATIVE PROMPT: company name, text at the top, low quality, generic template, cartoon, cheap graphics, AI artifacts, watermarks, blurry jewellery, distorted jewellery, Tamil text, Hindi text, rate increase/decrease arrows, news ticker, cluttered layout, poor typography, oversaturated colors, duplicate composition, stock imagery, repeated layout.

Style: Ultra realistic, 4K quality, commercial advertisement quality, luxury jewellery catalogue quality, perfect alignment, sharp typography, social-media ready.`;
}