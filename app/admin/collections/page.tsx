"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category?: string;
  weight_g: number;
  making_charge_pct: number;
  description: string;
  image: string;
  price?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  items: Product[];
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    name: "", category: "", weight_g: "", making_charge_pct: "10",
    description: "", price: "", image: null as File | null,
  });

  useEffect(() => {
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then((data) => {
        setCollections(data);
        if (data.length > 0) setSelectedCategory(data[0].slug);
        setLoading(false);
      });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("categorySlug", selectedCategory);
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("weight_g", form.weight_g);
    formData.append("making_charge_pct", form.making_charge_pct);
    formData.append("description", form.description);
    if (form.price) formData.append("price", form.price);
    if (form.image) formData.append("image", form.image);

    await fetch("/api/admin/collections", { method: "POST", body: formData });
    const updated = await fetch("/api/admin/collections").then((r) => r.json());
    setCollections(updated);
    setShowForm(false);
    setForm({ name: "", category: "", weight_g: "", making_charge_pct: "10", description: "", price: "", image: null });
    setSaving(false);
  };

  const handleDelete = async (categorySlug: string, itemId: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/collections?categorySlug=${categorySlug}&itemId=${itemId}`, { method: "DELETE" });
    const updated = await fetch("/api/admin/collections").then((r) => r.json());
    setCollections(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0418] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0418] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider mb-6">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Manage Collections
          </h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg text-xs">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-[#1a0b2e]/60 border border-[#D4AF37]/20 rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#D4AF37]">New Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Collection</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm">
                  {collections.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Product Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Bridal Necklace"
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Weight (grams)</label>
                <input type="number" step="0.1" value={form.weight_g} onChange={(e) => setForm({ ...form, weight_g: e.target.value })} required
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Making Charge (%)</label>
                <input type="number" value={form.making_charge_pct} onChange={(e) => setForm({ ...form, making_charge_pct: e.target.value })} required
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Fixed Price (optional)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2 px-3 text-white text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 mb-1">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                  className="w-full text-sm text-[#F3E5AB]/70" />
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Add Product"}
            </button>
          </form>
        )}

        {collections.map((cat) => (
          <div key={cat.slug} className="mb-8">
            <h2 className="font-serif text-xl font-bold text-[#F3E5AB] mb-4">{cat.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <div key={item.id} className="bg-[#1a0b2e]/50 border border-[#D4AF37]/15 rounded-xl p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-900" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-[#F3E5AB]/60">{item.weight_g}g • {item.making_charge_pct}% making</p>
                    <p className="text-[10px] text-[#F3E5AB]/40 truncate mt-1">{item.description}</p>
                    <button onClick={() => handleDelete(cat.slug, item.id)}
                      className="mt-2 text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
