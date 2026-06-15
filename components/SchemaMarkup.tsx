import React from "react";
import { SITE_URL } from "@/utils/seo";
import { BRAND } from "@/utils/brand";

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
    "@id": `${SITE_URL}/#organization`,
    "name": BRAND.name,
    "url": SITE_URL,
    "logo": `${SITE_URL}${BRAND.logo}`,
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
        "@id": `${SITE_URL}/#localbusiness`,
        "name": BRAND.name,
        "image": `${SITE_URL}/images/sri-velmayil-jewellery-shop-tirupur.jpg`,
        "telephone": BRAND.phoneE164,
        "url": SITE_URL,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "89 New Market Street",
          "addressLocality": BRAND.location,
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

// Helper factory for Product Schema
export function getProductSchema(product: {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  categoryUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${product.categoryUrl}#${product.id}`,
    name: product.name,
    image: product.image.startsWith("http") ? product.image : `${SITE_URL}${product.image}`,
    description: product.description,
    brand: { "@type": "Brand", name: BRAND.name },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      url: product.categoryUrl,
    },
  };
}

// Helper factory for Article Schema
// Helper factory for Breadcrumbs
export function getArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.datePublished,
    author: { "@type": "Organization", name: BRAND.name },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}${BRAND.logo}` },
    },
    ...(article.image ? { image: article.image } : {}),
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
      "item": item.item
    }))
  };
}
