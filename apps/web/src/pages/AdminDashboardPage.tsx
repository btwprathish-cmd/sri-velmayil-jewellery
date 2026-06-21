import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, LayoutDashboard, LogOut, PlusCircle, ChevronDown, ChevronUp, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { getSession, logout } from "@/utils/auth";
import { uploadImage } from "@/utils/upload-image";
import collectionsData from "@/data/collections.json";

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
  metal: "Gold",
  category: "Coin",
  name: "",
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
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      if (!s.authenticated) setLocation("/admin/login");
    });
  }, [setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  function handleFormChange(field: keyof ProductFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormSuccess(false);
    setFormError("");
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError("");
    setFormSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (.jpg, .jpeg, .png, .webp)");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!form.metal || !form.category || !form.name || !form.weight_g || !form.making_charge_pct) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name,
        metal: form.metal,
        category: form.category,
        weight_g: parseFloat(form.weight_g),
        making_charge_pct: parseFloat(form.making_charge_pct),
        description: form.description,
        imageUrl,
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save product");
      }

      setFormSuccess(true);
      setForm(defaultForm);
      handleRemoveImage();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!session) return <div className="min-h-screen bg-[#0c0418] flex items-center justify-center text-[#D4AF37]">Loading...</div>;

  const totalProducts = (collectionsData as Array<{ items: unknown[] }>).reduce((sum, cat) => sum + cat.items.length, 0);

  const cards = [
    { title: "Collections", value: collectionsData.length, icon: LayoutDashboard, href: "/jewellery-collections", color: "text-sky-400" },
    { title: "Products", value: totalProducts, icon: Package, href: "/jewellery-collections", color: "text-emerald-400" },
  ];

  const isFormValid = !imageError;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl gap-6 mb-12 items-stretch">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}
              className="bg-[#1a0b2e]/60 border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all group flex flex-col justify-between h-full shadow-lg"
            >
              <card.icon className={`h-8 w-8 ${card.color} mb-3`} />
              <div>
                <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
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
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
              
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
                    Weight <span className="text-[#D4AF37]">*</span> <span className="lowercase text-[#F3E5AB]/50 font-normal ml-1">(grams)</span>
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
                    Making Charge <span className="text-[#D4AF37]">*</span> <span className="text-[#F3E5AB]/50 font-normal ml-1">(%)</span>
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
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm resize-y"
                />
              </div>

              {/* Product Image Upload Section */}
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Product Image
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block border border-[#D4AF37]/30 rounded-lg overflow-hidden bg-[#0c0418]">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                      title="Remove Image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-[#D4AF37]/20 rounded-xl p-8 flex flex-col items-center justify-center text-[#F3E5AB]/50 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs opacity-60 mt-1">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                {imageError && <p className="text-red-400 text-xs mt-2 font-medium">{imageError}</p>}
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              {formSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm">
                  Product saved successfully!
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#D4AF37]/10">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(defaultForm); setFormSuccess(false); setFormError(""); handleRemoveImage(); setShowUploadForm(false); }}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-[#D4AF37]/20 text-[#F3E5AB]/70 font-bold rounded-lg text-sm hover:border-[#D4AF37]/40 transition-colors disabled:opacity-50 disabled:pointer-events-none order-2 sm:order-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
