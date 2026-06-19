import React from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, User, Clock, ShieldCheck } from "lucide-react";
import blogPosts from "@/data/blog-posts.json";
import { formatIndianDate } from "@/utils/date";

const blogImages: Record<string, string> = {
  "difference-between-22k-and-24k-gold": "https://images.unsplash.com/photo-1610375461246-83df859d8222?auto=format&fit=crop&q=80&w=1000",
  "how-to-check-bis-hallmark": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000",
  "gold-investment-guide": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000",
  "wedding-jewellery-buying-guide": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=1000",
  "daily-gold-rate-updates": "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=1000",
};

function parseMarkdownInlines(text: string): string {
  let parsed = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  return parsed;
}

function MarkdownRenderer({ content }: { content: string }) {
  const blocks = content.split("\n\n");
  return (
    <div className="space-y-6 text-[#F3E5AB]/85 font-sans leading-relaxed">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="font-serif text-2xl font-bold text-white pt-6 pb-2 border-b border-[#D4AF37]/10">{trimmed.substring(4)}</h3>;
        }
        if (trimmed.startsWith("- ")) {
          return (
            <ul key={i} className="list-disc list-inside pl-4 space-y-2">
              {trimmed.split("\n").map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseMarkdownInlines(item.replace(/^- /, "")) }} />
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <ol key={i} className="list-decimal list-inside pl-4 space-y-2">
              {trimmed.split("\n").map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseMarkdownInlines(item.replace(/^\d+\.\s/, "")) }} />
              ))}
            </ol>
          );
        }
        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n");
          const headers = rows[0].split("|").map(c => c.trim()).filter(Boolean);
          const bodyRows = rows.slice(2).map(r => r.split("|").map(c => c.trim()).filter(Boolean));
          return (
            <div key={i} className="overflow-x-auto my-6 border border-[#D4AF37]/15 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#1a0b2e] border-b border-[#D4AF37]/20 text-[#D4AF37] font-serif uppercase tracking-wider">
                    {headers.map((h, idx) => <th key={idx} className="p-3.5 font-bold">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 bg-[#1a0b2e]/30">
                  {bodyRows.map((r, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#D4AF37]/5 transition-colors">
                      {r.map((cell, cIdx) => <td key={cIdx} className="p-3.5 font-mono text-white" dangerouslySetInnerHTML={{ __html: parseMarkdownInlines(cell) }} />)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: parseMarkdownInlines(trimmed) }} />;
      })}
    </div>
  );
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = (blogPosts as Array<{ slug: string; title: string; excerpt: string; date: string; author: string; content: string }>).find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="py-32 text-center">
        <p className="text-[#F3E5AB]/60 mb-4">Blog post not found.</p>
        <Link href="/blog" className="text-[#D4AF37] hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <article className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <div className="space-y-6 border-b border-[#D4AF37]/20 pb-8 mb-8 text-center md:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">{post.title}</h1>
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs sm:text-sm text-[#F3E5AB]/60 font-sans">
          <span className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-[#D4AF37]" />{formatIndianDate(post.date)}</span>
          <span className="flex items-center"><User className="h-4 w-4 mr-2 text-[#D4AF37]" />By {post.author}</span>
          <span className="flex items-center"><Clock className="h-4 w-4 mr-2 text-[#D4AF37]" />5 min read</span>
        </div>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-xl mb-12 bg-gray-900">
        <img
          src={blogImages[post.slug] || "https://images.unsplash.com/photo-1610375461246-83df859d8222?auto=format&fit=crop&q=80&w=1000"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      <div className="mt-16 bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 sm:p-8 flex items-start space-x-4">
        <ShieldCheck className="h-8 w-8 text-[#D4AF37] flex-shrink-0 mt-1" />
        <div className="text-xs sm:text-sm">
          <h4 className="font-serif font-bold text-white uppercase tracking-wider mb-1">Sri Velmayil Jewellery Trust Certification</h4>
          <p className="text-[#F3E5AB]/65 font-sans leading-relaxed">
            This article was written by our specialists to guide buyers in making secure gold purchases. At our Tirupur showroom, we prioritize educating our consumers so you buy with absolute confidence.
          </p>
        </div>
      </div>
    </article>
  );
}
