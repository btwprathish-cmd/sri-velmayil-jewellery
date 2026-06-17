import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, TrendingUp, Image, LayoutDashboard, LogOut } from "lucide-react";
import { getSession, logout } from "@/utils/auth";
import collectionsData from "@/data/collections.json";

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<{ authenticated: boolean; username: string | null } | null>(null);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      if (!s.authenticated) setLocation("/admin/login");
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  if (!session) return <div className="min-h-screen bg-[#0c0418] flex items-center justify-center text-[#D4AF37]">Loading...</div>;

  const totalProducts = (collectionsData as Array<{ items: unknown[] }>).reduce((sum, cat) => sum + cat.items.length, 0);

  const cards = [
    { title: "Collections", value: collectionsData.length, icon: LayoutDashboard, href: "/jewellery-collections", color: "text-sky-400" },
    { title: "Products", value: totalProducts, icon: Package, href: "/jewellery-collections", color: "text-emerald-400" },
    { title: "Live Rates", value: "Live", icon: TrendingUp, href: "/gold-rate-today-tirupur", color: "text-[#D4AF37]" },
    { title: "Blog Posts", value: "5", icon: Image, href: "/blog", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0418] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Admin Dashboard</h1>
            <p className="text-sm text-[#F3E5AB]/60 mt-1">Welcome, {session.username}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}
              className="bg-[#1a0b2e]/60 border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all group"
            >
              <card.icon className={`h-8 w-8 ${card.color} mb-3`} />
              <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider">{card.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
            </Link>
          ))}
        </div>

        <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6">
          <h2 className="font-serif text-lg font-bold text-[#D4AF37] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/gold-rate-today-tirupur" className="py-3 px-4 bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg text-sm font-bold text-[#F3E5AB] hover:border-[#D4AF37]/50 transition-colors text-center">
              View Live Rates
            </Link>
            <Link href="/jewellery-collections" className="py-3 px-4 bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg text-sm font-bold text-[#F3E5AB] hover:border-[#D4AF37]/50 transition-colors text-center">
              View Products
            </Link>
            <Link href="/blog" className="py-3 px-4 bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg text-sm font-bold text-[#F3E5AB] hover:border-[#D4AF37]/50 transition-colors text-center">
              View Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
