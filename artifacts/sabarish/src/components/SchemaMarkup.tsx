import React from "react";

interface SchemaMarkupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export default function SchemaMarkup({ data }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = "https://srivelmayiljewellery.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Sri Velmayil Jewellery",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/sri-velmayil-jewellery-logo-tirupur.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9443476183",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "ta"],
    },
  };
}

export function getJewelryStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "JewelryStore"],
        "@id": `${SITE_URL}/#localbusiness`,
        "name": "Sri Velmayil Jewellery",
        "telephone": "+919443476183",
        "url": SITE_URL,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "89 New Market Street",
          "addressLocality": "Tirupur",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641604",
          "addressCountry": "IN",
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:30",
            "closes": "21:00",
          },
        ],
      },
    ],
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };
}
