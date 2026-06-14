import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import blogPosts from "@/data/blog-posts.json";
import { formatIndianDate } from "@/utils/date";
import { getSeoMetadata } from "@/utils/seo";

export const metadata = getSeoMetadata({
  title: "Jewellery Blog | Gold Guides & Tips - Sri Velmayil Jewellery",
  description: "Read educational articles and guides about gold jewellery. Learn how to verify BIS hallmarking, standard carats, gold investing, and wedding buying guides.",
  path: "/blog"
});

export default function BlogListPage() {
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "https://srivelmayiljewellery.com" },
    { name: "Blog", item: "https://srivelmayiljewellery.com/blog" }
  ]);

  // Unsplash fallbacks for blog illustrations to keep layouts wowing
  const blogImages: Record<string, string> = {
    "difference-between-22k-and-24k-gold": "https://images.unsplash.com/photo-1610375461246-83df859d8222?auto=format&fit=crop&q=80&w=600",
    "how-to-check-bis-hallmark": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
    "gold-investment-guide": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600",
    "wedding-jewellery-buying-guide": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600",
    "daily-gold-rate-updates": "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=600"
  };

  return (
    <>
      <SchemaMarkup data={breadcrumbData} />

      <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
              Jewellery Guides & Tips
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Sri Velmayil Jewellery Blog
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
            Read our expert advice on buying gold, checking purity, and tracking market trends in Tirupur.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl overflow-hidden hover:border-[#D4AF37]/45 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blogImages[post.slug] || "https://images.unsplash.com/photo-1610375461246-83df859d8222?auto=format&fit=crop&q=80&w=600"}
                  alt={`${post.title} | Sri Velmayil Jewellery Blog`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418] via-transparent to-transparent opacity-85"></div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-[10px] text-[#F3E5AB]/50 font-sans">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-[#D4AF37]/80" />
                      {formatIndianDate(post.date)}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1 text-[#D4AF37]/80" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-white hover:text-[#D4AF37] transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-xs text-[#F3E5AB]/65 font-sans leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/10">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:text-[#F3E5AB] group/link"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
