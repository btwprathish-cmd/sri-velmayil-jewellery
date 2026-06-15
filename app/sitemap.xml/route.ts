import { NextResponse } from "next/server";
import collectionsData from "@/data/collections.json";
import blogPosts from "@/data/blog-posts.json";
import { getAllRates } from "@/utils/rates";
import { SITE_URL } from "@/utils/seo";

export const revalidate = 3600;

export async function GET() {
  const domain = SITE_URL;
  const goldRatesData = await getAllRates();

  const staticPaths = [
    "",
    "/about-us",
    "/contact-us",
    "/jewellery-collections",
    "/gold-rate-today-tirupur",
    "/silver-rate-today-tirupur",
    "/gold-rate-history",
    "/poster-generator",
    "/faq",
    "/blog",
  ];

  const categoryPaths = collectionsData.map((c) => `/jewellery-collections/${c.slug}`);
  const goldRatePaths = goldRatesData.map((r) => `/gold-rate/${r.date}`);
  const blogPaths = blogPosts.map((p) => `/blog/${p.slug}`);

  const allPaths = [...staticPaths, ...categoryPaths, ...goldRatePaths, ...blogPaths];

  const xmlItems = allPaths
    .map(
      (path) => `
  <url>
    <loc>${domain}${path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${path === "/gold-rate-today-tirupur" || path === "/silver-rate-today-tirupur" ? "hourly" : "weekly"}</changefreq>
    <priority>${path === "" ? "1.0" : path.includes("gold-rate-today") || path.includes("silver-rate-today") ? "0.9" : "0.7"}</priority>
  </url>`
    )
    .join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  return new NextResponse(sitemapXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}
