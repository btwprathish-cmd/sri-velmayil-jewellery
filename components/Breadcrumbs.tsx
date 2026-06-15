import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import SchemaMarkup, { getBreadcrumbSchema } from "@/components/SchemaMarkup";
import { SITE_URL } from "@/utils/seo";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = [
    { name: "Home", item: SITE_URL },
    ...items.map((item) => ({ name: item.name, item: `${SITE_URL}${item.href}` })),
  ];

  return (
    <>
      <SchemaMarkup data={getBreadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-[#F3E5AB]/60 font-sans">
          <li className="flex items-center">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-[#D4AF37]/50" aria-hidden="true" />
              {index === items.length - 1 ? (
                <span className="text-[#D4AF37] font-semibold" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#D4AF37] transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
