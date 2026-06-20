import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, TrendingUp, Image, LayoutDashboard, LogOut, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getSession, logout } from "@/utils/auth";
import collectionsData from "@/data/collections.json";
import blogPostsData from "@/data/blog-posts.json";
import { fetchLatestRate } from "@/utils/rates";

const METALS = ["Gold", "Silver"] as const;
const CATEGORIES = ["Coin", "Ring", "Chain", "Earring", "Bracelet", "Anklet"] as const;

type Metal = typeof METALS[number];
type Category = typeof CATEGORIES[number];

interface ProductFormState {
  name: string;
  metal: Metal;
  category: Category;
  weight_g: string;
  making_charge_pct: string;
  description: string;
}

const defaultForm: ProductFormState = {
  name: "",
  metal: "Gold",
  category: "Ring",
  weight_g: "",
  making_charge_pct: "",
  description: "",
};

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<{ authenticated: boolean; username: string | null } | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [form, setForm] = useState<ProductFormState>(defaultForm);
  const [formSuccess, setFormSuccess] = useState(false);
  const [latestRateStr, setLatestRateStr] = useState<string>("Loading...");

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      if (!s.authenticated) setLocation("/admin/login");
    });
    fetchLatestRate()
      .then((rate) => setLatestRateStr(`₹${rate.gold22k_1g.toLocaleString("en-IN")}/g`))
      .catch(() => setLatestRateStr("Unavailable"));
  }, [setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  function handleFormChange(field: keyof ProductFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormSuccess(false);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Persist to backend when API is available
    console.log("[Admin] New product submitted:", {
      name: form.name,
      metal: form.metal,
      category: form.category,
      weight_g: parseFloat(form.weight_g),
      making_charge_pct: parseFloat(form.making_charge_pct),
      description: form.description,
    });
    setFormSuccess(true);
    setForm(defaultForm);
  }

  if (!session) return <div className="min-h-screen bg-[#0c0418] flex items-center justify-center text-[#D4AF37]">Loading...</div>;

  const totalProducts = (collectionsData as Array<{ items: unknown[] }>).reduce((sum, cat) => sum + cat.items.length, 0);

  const cards = [
    { title: "Collections", value: collectionsData.length, icon: LayoutDashboard, href: "/jewellery-collections", color: "text-sky-400" },
    { title: "Products", value: totalProducts, icon: Package, href: "/jewellery-collections", color: "text-emerald-400" },
    { title: "Live 22K Rate", value: latestRateStr, icon: TrendingUp, href: "/gold-rate-today-tirupur", color: "text-[#D4AF37]" },
    { title: "Blog Posts", value: blogPostsData.length, icon: Image, href: "/blog", color: "text-purple-400" },
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

        {/* Product Upload Form */}
        <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-[#D4AF37]">Add New Product</h2>
            </div>
            {showUploadForm ? (
              <ChevronUp className="h-5 w-5 text-[#F3E5AB]/50" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#F3E5AB]/50" />
            )}
          </button>

          {showUploadForm && (
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Metal Type <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={form.metal}
                    onChange={(e) => handleFormChange("metal", e.target.value)}
                    required
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  >
                    {METALS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Category <span className="text-[#D4AF37]">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    required
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Product Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  required
                  placeholder="e.g. Classic Gold Coin 1g"
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Weight (Grams) <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.weight_g}
                    onChange={(e) => handleFormChange("weight_g", e.target.value)}
                    required
                    placeholder="e.g. 4.5"
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Making Charge (%) <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={form.making_charge_pct}
                    onChange={(e) => handleFormChange("making_charge_pct", e.target.value)}
                    required
                    placeholder="e.g. 10"
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Brief description of the product..."
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>

              {formSuccess && (
                <p className="text-emerald-400 text-xs text-center font-semibold">
                  Product details saved successfully.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(defaultForm); setFormSuccess(false); setShowUploadForm(false); }}
                  className="px-6 py-3 border border-[#D4AF37]/20 text-[#F3E5AB]/70 font-bold rounded-lg text-sm hover:border-[#D4AF37]/40 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
