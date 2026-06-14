import { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://srivelmayiljewellery.com";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
}

export function getSeoMetadata(options: SeoOptions): Metadata {
  const { title, description, path, ogImage, type = "website", keywords = [] } = options;
  const canonicalUrl = `${SITE_URL}${path}`;
  const resolvedOgImage = ogImage 
    ? `${SITE_URL}${ogImage}` 
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  const baseKeywords = [
    "gold jewellery", 
    "jewellery shop in Tirupur", 
    "Sri Velmayil Jewellery", 
    "gold rate today Tirupur", 
    "916 gold hallmarked Tirupur", 
    "wedding jewellery Tirupur", 
    "best jewellery store Tirupur"
  ];

  const uniqueKeywords = Array.from(new Set([...baseKeywords, ...keywords]));

  return {
    title,
    description,
    keywords: uniqueKeywords.join(", "),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sri Velmayil Jewellery",
      locale: "en_IN",
      type,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
    },
    other: {
      "google-site-verification": "NEXT_PUBLIC_GSC_VERIFICATION_PLACEHOLDER",
    },
  };
}
