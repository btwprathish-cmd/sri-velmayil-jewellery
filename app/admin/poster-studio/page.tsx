import PosterStudio from "@/components/PosterStudio";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPosterStudioPage() {
  return (
    <>
      <div className="bg-[#0c0418] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Dashboard
          </Link>
        </div>
      </div>
      <PosterStudio />
    </>
  );
}
