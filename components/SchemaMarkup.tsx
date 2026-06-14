import React from "react";

interface SchemaMarkupProps {
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

// Helper factory to generate Organization Schema
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://srivelmayiljewellery.com/#organization",
    "name": "Sri Velmayil Jewellery",
    "url": "https://srivelmayiljewellery.com",
    "logo": "https://srivelmayiljewellery.com/images/sri-velmayil-jewellery-logo-tirupur.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9443476183",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "ta"]
    }
  };
}

// Helper factory to generate LocalBusiness + JewelryStore Schema
export function getJewelryStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "JewelryStore"],
        "@id": "https://srivelmayiljewellery.com/#localbusiness",
        "name": "Sri Velmayil Jewellery",
        "image": "https://srivelmayiljewellery.com/images/sri-velmayil-jewellery-shop-tirupur.jpg",
        "telephone": "+919443476183",
        "url": "https://srivelmayiljewellery.com",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "89 New Market Street",
          "addressLocality": "Tirupur",
          "addressRegion": "Tamil Nadu",
          "postalCode": "641604",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.1085",
          "longitude": "77.3411"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "09:30",
            "closes": "21:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/srivelmayiljewellery",
          "https://www.instagram.com/srivelmayiljewellery"
        ]
      }
    ]
  };
}

// Helper factory for Breadcrumbs
export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}
