import { NextResponse } from "next/server";
import collectionsData from "@/data/collections.json";
import goldRatesData from "@/data/gold-rates.json";
import blogPosts from "@/data/blog-posts.json";

export async function GET() {
  const domain = "https://srivelmayiljewellery.com";

  // 1. Static paths
  const staticPaths = [
    "",
    "/about-us",
    "/contact-us",
    "/jewellery-collections",
    "/gold-rate-today-tirupur",
    "/gold-rate-history",
    "/poster-generator",
    "/faq",
    "/blog"
  ];

  // 2. Dynamic paths
  const categoryPaths = collectionsData.map(c => `/jewellery-collections/${c.slug}`);
  const goldRatePaths = goldRatesData.map(r => `/gold-rate/${r.date}`);
  const blogPaths = blogPosts.map(p => `/blog/${p.slug}`);

  // Combine all paths
  const allPaths = [...staticPaths, ...categoryPaths, ...goldRatePaths, ...blogPaths];

  // Build XML content
  const xmlItems = allPaths.map(path => `
  <url>
    <loc>${domain}${path}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${path === "/gold-rate-today-tirupur" ? "hourly" : "weekly"}</changefreq>
    <priority>${path === "" ? "1.0" : path.startsWith("/gold-rate-today") ? "0.9" : "0.7"}</priority>
  </url>`).join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>
  `;

  return new NextResponse(sitemapXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200"
    }
  });
}
