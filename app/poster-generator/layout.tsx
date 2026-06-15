import { getSeoMetadata } from "@/utils/seo";

export const metadata = getSeoMetadata({
  title: "Daily Gold Rate Poster Generator | Sri Velmayil Jewellery Tirupur",
  description:
    "Automatically generate unique luxury gold rate posters for WhatsApp Status, Instagram Stories, and Facebook. Live 22K gold and silver rates for Tirupur.",
  path: "/poster-generator",
  keywords: [
    "gold rate poster Tirupur",
    "jewellery poster generator",
    "WhatsApp gold rate status",
    "Instagram story gold rate",
    "Sri Velmayil Jewellery poster",
  ],
});

export default function PosterGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
