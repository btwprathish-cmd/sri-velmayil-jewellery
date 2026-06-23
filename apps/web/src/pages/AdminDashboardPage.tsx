import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, LayoutDashboard, LogOut, PlusCircle, ChevronDown, ChevronUp, Image as ImageIcon, X, Loader2, Edit2, Trash2, Layers } from "lucide-react";
import { getSession, logout } from "@/utils/auth";
import { uploadImage } from "@/utils/upload-image";
import { getCollections, saveCollectionItem, getMetals, getCategories, addMetal, addCategory, deleteMetal, updateMetal, deleteCategory, updateCategory, deleteProduct, updateProduct, type CollectionBlock, type MetalData, type CategoryData, type CollectionItem } from "@/utils/collections";

interface ProductFormState {
  name: string;
  metal: string;
  category: string;
  weight_g: string;
  making_charge_pct: string;
  description: string;
}

const defaultForm: ProductFormState = {
  metal: "",
  category: "",
  name: "",
  weight_g: "",
  making_charge_pct: "",
  description: "",
};

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<{ authenticated: boolean; username: string | null } | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  const [form, setForm] = useState<ProductFormState>(defaultForm);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [collections, setCollections] = useState<CollectionBlock[]>([]);
  const [metalsList, setMetalsList] = useState<MetalData[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryData[]>([]);
  
  const [newMetal, setNewMetal] = useState<MetalData>({ name: "", purityLabel: "", description: "" });
  const [newMetalImage, setNewMetalImage] = useState<File | null>(null);
  const [newMetalImagePreview, setNewMetalImagePreview] = useState<string | null>(null);
  const [isSubmittingMetal, setIsSubmittingMetal] = useState(false);

  const [newCategory, setNewCategory] = useState<CategoryData>({ name: "", description: "", metals: [] });
  const [collectionSuccess, setCollectionSuccess] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);
  
  type ViewState = "dashboard" | "collections" | "categories" | "products";
  const [activeView, setActiveView] = useState<ViewState>("dashboard");

  const [editingMetal, setEditingMetal] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      if (!s.authenticated) setLocation("/admin/login");
    });
    Promise.all([getCollections(), getMetals(), getCategories()]).then(([cols, mets, cats]) => {
      setCollections(cols);
      setMetalsList(mets);
      setCategoriesList(cats);
    });
  }, [setLocation]);

  const handleAddCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMetal.name.trim()) return;
    setIsSubmittingMetal(true);
    try {
      let imageUrl = newMetalImagePreview && !newMetalImage ? newMetalImagePreview : "";
      if (newMetalImage) {
        imageUrl = await uploadImage(newMetalImage);
      }
      if (editingMetal) {
        await updateMetal(editingMetal, { ...newMetal, imageUrl });
        setEditingMetal(null);
      } else {
        await addMetal({ ...newMetal, imageUrl });
      }
      const [newMetals, newCols] = await Promise.all([getMetals(), getCollections()]);
      setMetalsList(newMetals);
      setCollections(newCols);
      setNewMetal({ name: "", purityLabel: "", description: "" });
      setNewMetalImage(null);
      setNewMetalImagePreview(null);
      setCollectionSuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to save metal. Check configuration.");
    } finally {
      setIsSubmittingMetal(false);
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      if (editingCategory) {
        await updateCategory(editingCategory, newCategory);
        setEditingCategory(null);
      } else {
        await addCategory(newCategory);
      }
      const [newCats, newCols] = await Promise.all([getCategories(), getCollections()]);
      setCategoriesList(newCats);
      setCollections(newCols);
      setNewCategory({ name: "", description: "", metals: [] });
      setCategorySuccess(true);
    } catch (err: any) {
      alert(err.message || "Failed to save category.");
    }
  };

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
      let imageUrl = imagePreview && !imageFile ? imagePreview : "";
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadErr: any) {
          throw new Error("Image upload failed: Please check your Cloudinary configuration (.env).");
        }
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

      if (editingProduct) {
        await updateProduct(editingProduct, payload);
        setEditingProduct(null);
      } else {
        await saveCollectionItem(payload);
      }
      
      // Refresh dashboard counts
      const newCols = await getCollections();
      setCollections(newCols);

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

  const totalProducts = collections.reduce((sum, cat) => sum + cat.items.length, 0);
  const uniqueCollections = metalsList.length;
  const uniqueCategories = categoriesList.length;

  const cards = [
    { title: "Add New", value: "", icon: PlusCircle, view: "dashboard", color: "text-[#D4AF37]" },
    { title: "Collections", value: uniqueCollections, icon: LayoutDashboard, view: "collections", color: "text-sky-400" },
    { title: "Categories", value: uniqueCategories, icon: Layers, view: "categories", color: "text-purple-400" },
    { title: "Products", value: totalProducts, icon: Package, view: "products", color: "text-emerald-400" },
  ];

  const isFormValid = !imageError;

  return (
    <div className="min-h-screen bg-[#0c0418] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-center mb-10">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Admin Dashboard</h1>
            <p className="text-sm text-[#F3E5AB]/60 mt-1">Welcome, {session.username}</p>
          </div>
          <button onClick={handleLogout}
            className="absolute right-0 flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto gap-6 mb-12 items-stretch">
          {cards.map((card) => (
            <button key={card.title} onClick={() => setActiveView(card.view as ViewState)}
              className={`bg-[#1a0b2e]/60 border ${activeView === card.view ? 'border-[#D4AF37]' : 'border-[#D4AF37]/15'} rounded-2xl p-6 hover:border-[#D4AF37]/40 transition-all group flex flex-col justify-between h-full shadow-lg text-left`}
            >
              <card.icon className={`h-8 w-8 ${card.color} mb-3`} />
              <div>
                <p className="text-xs text-[#F3E5AB]/60 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value === "" ? '\u00A0' : card.value}</p>
              </div>
            </button>
          ))}
        </div>

        {activeView === "dashboard" && (
          <>
            {/* Add Collection Form */}
            <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowAddCollection(!showAddCollection)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-sky-400" />
              <h2 className="font-serif text-lg font-bold text-sky-400">{editingMetal ? `Edit Collection: ${editingMetal}` : "Add New Collection (Metal)"}</h2>
            </div>
            {showAddCollection ? (
              <ChevronUp className="h-5 w-5 text-[#F3E5AB]/50" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#F3E5AB]/50" />
            )}
          </button>

          {showAddCollection && (
            <form onSubmit={handleAddCollectionSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={newMetal.name}
                    onChange={(e) => { setNewMetal({ ...newMetal, name: e.target.value }); setCollectionSuccess(false); }}
                    required
                    placeholder="e.g. Platinum"
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-sky-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                    Purity Label
                  </label>
                  <input
                    type="text"
                    value={newMetal.purityLabel}
                    onChange={(e) => { setNewMetal({ ...newMetal, purityLabel: e.target.value }); setCollectionSuccess(false); }}
                    placeholder="e.g. 95% Pure Platinum"
                    className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-sky-400 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newMetal.description}
                  onChange={(e) => { setNewMetal({ ...newMetal, description: e.target.value }); setCollectionSuccess(false); }}
                  placeholder="Short description for the collections page..."
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-sky-400 text-sm resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Collection Cover Image
                </label>
                {newMetalImagePreview ? (
                  <div className="relative inline-block border border-[#D4AF37]/30 rounded-lg overflow-hidden bg-[#0c0418]">
                    <img src={newMetalImagePreview} alt="Preview" className="w-32 h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setNewMetalImage(null); setNewMetalImagePreview(null); }}
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate type
                          const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
                          if (!validTypes.includes(file.type)) {
                            alert("Please upload a valid image file (.jpg, .jpeg, .png, .webp)");
                            return;
                          }
                          // Validate size (5MB max)
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image must be under 5MB");
                            return;
                          }
                          setNewMetalImage(file);
                          setNewMetalImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {collectionSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm">
                  Collection saved successfully!
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#D4AF37]/10">
                <button
                  type="button"
                  onClick={() => { setNewMetal({ name: "", purityLabel: "", description: "" }); setCollectionSuccess(false); setNewMetalImage(null); setNewMetalImagePreview(null); setShowAddCollection(false); setEditingMetal(null); }}
                  disabled={isSubmittingMetal}
                  className="px-8 py-3 border border-[#D4AF37]/20 text-[#F3E5AB]/70 font-bold rounded-lg text-sm hover:border-[#D4AF37]/40 transition-colors disabled:opacity-50 disabled:pointer-events-none order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMetal}
                  className="px-10 py-3 bg-gradient-to-r from-sky-500 to-sky-300 text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {isSubmittingMetal ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {editingMetal ? "Update Collection" : "Save Collection"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Add Category Form */}
        <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-purple-400" />
              <h2 className="font-serif text-lg font-bold text-purple-400">{editingCategory ? `Edit Category: ${editingCategory}` : "Add New Category (Type)"}</h2>
            </div>
            {showAddCategory ? (
              <ChevronUp className="h-5 w-5 text-[#F3E5AB]/50" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#F3E5AB]/50" />
            )}
          </button>

          {showAddCategory && (
            <form onSubmit={handleAddCategorySubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => { setNewCategory({ ...newCategory, name: e.target.value }); setCategorySuccess(false); }}
                  required
                  placeholder="e.g. Pendant"
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-purple-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCategory.description}
                  onChange={(e) => { setNewCategory({ ...newCategory, description: e.target.value }); setCategorySuccess(false); }}
                  placeholder="Short description for the categories grid..."
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-purple-400 text-sm resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Assign to Collections
                </label>
                <div className="flex flex-wrap gap-3">
                  {metalsList.map((metal) => (
                    <label key={metal.name} className="flex items-center gap-2 cursor-pointer bg-[#0c0418] border border-[#D4AF37]/20 px-3 py-2 rounded-lg hover:border-purple-400 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={newCategory.metals?.includes(metal.name) || false}
                        onChange={(e) => {
                          const currentMetals = newCategory.metals || [];
                          const newMetals = e.target.checked 
                            ? [...currentMetals, metal.name]
                            : currentMetals.filter(m => m !== metal.name);
                          setNewCategory({ ...newCategory, metals: newMetals });
                          setCategorySuccess(false);
                        }}
                        className="rounded border-[#D4AF37]/30 text-purple-500 focus:ring-purple-500 bg-[#0c0418]"
                      />
                      <span className="text-sm text-white">{metal.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {categorySuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm">
                  Category saved successfully!
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#D4AF37]/10">
                <button
                  type="button"
                  onClick={() => { setNewCategory({ name: "", description: "", metals: [] }); setCategorySuccess(false); setShowAddCategory(false); setEditingCategory(null); }}
                  className="px-8 py-3 border border-[#D4AF37]/20 text-[#F3E5AB]/70 font-bold rounded-lg text-sm hover:border-[#D4AF37]/40 transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-gradient-to-r from-purple-500 to-purple-300 text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all flex items-center justify-center order-1 sm:order-2"
                >
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Product Upload Form */}
        <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-[#D4AF37]">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
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
                    <option value="" disabled>Select Collection</option>
                    {metalsList.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
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
                    <option value="" disabled>Select Category</option>
                    {categoriesList.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
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

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#D4AF37]/10">
                <button
                  type="button"
                  onClick={() => { setForm(defaultForm); setFormSuccess(false); setFormError(""); handleRemoveImage(); setShowUploadForm(false); }}
                  disabled={isSubmitting}
                  className="px-8 py-3 border border-[#D4AF37]/20 text-[#F3E5AB]/70 font-bold rounded-lg text-sm hover:border-[#D4AF37]/40 transition-colors disabled:opacity-50 disabled:pointer-events-none order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="px-10 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingProduct ? "Update Product" : "Save Product"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
          </>
        )}

        {activeView === "collections" && (
          <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-xl font-bold text-sky-400 mb-6">Manage Collections</h2>
            <div className="space-y-4">
              {metalsList.map((metal) => (
                <div key={metal.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0c0418] border border-[#D4AF37]/10 rounded-xl gap-4">
                  <div className="flex items-center gap-4">
                    {metal.imageUrl ? (
                      <img src={metal.imageUrl} alt={metal.name} className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/20" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                        <ImageIcon className="h-5 w-5 text-[#D4AF37]/50" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg">{metal.name}</h3>
                      <p className="text-xs text-[#F3E5AB]/60">{metal.purityLabel || "No purity label"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => {
                        setEditingMetal(metal.name);
                        setNewMetal({ name: metal.name, purityLabel: metal.purityLabel || "", description: metal.description || "" });
                        setNewMetalImagePreview(metal.imageUrl || null);
                        setNewMetalImage(null);
                        setShowAddCollection(true);
                        setActiveView("dashboard");
                      }}
                      className="p-2 hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Edit</span>
                    </button>
                    <button 
                      onClick={async () => {
                        const confirmDelete = window.confirm(`Are you sure you want to delete the ${metal.name} collection?`);
                        if (confirmDelete) {
                          await deleteMetal(metal.name);
                          const [newMetals, newCols] = await Promise.all([getMetals(), getCollections()]);
                          setMetalsList(newMetals);
                          setCollections(newCols);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {metalsList.length === 0 && <p className="text-[#F3E5AB]/50 text-sm">No collections found.</p>}
            </div>
          </div>
        )}

        {activeView === "categories" && (
          <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-xl font-bold text-purple-400 mb-6">Manage Categories</h2>
            <div className="space-y-4">
              {categoriesList.map((cat) => (
                <div key={cat.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0c0418] border border-[#D4AF37]/10 rounded-xl gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                      {cat.metals && cat.metals.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cat.metals.map((m: string) => (
                            <span key={m} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 uppercase tracking-wider">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#F3E5AB]/60 mt-1.5 line-clamp-1">{cat.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => {
                        setEditingCategory(cat.name);
                        setNewCategory({ name: cat.name, description: cat.description || "", metals: cat.metals || [] });
                        setShowAddCategory(true);
                        setActiveView("dashboard");
                      }}
                      className="p-2 hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Edit</span>
                    </button>
                    <button 
                      onClick={async () => {
                        const confirmDelete = window.confirm(`Are you sure you want to delete the ${cat.name} category?`);
                        if (confirmDelete) {
                          await deleteCategory(cat.name);
                          const [newCats, newCols] = await Promise.all([getCategories(), getCollections()]);
                          setCategoriesList(newCats);
                          setCollections(newCols);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {categoriesList.length === 0 && <p className="text-[#F3E5AB]/50 text-sm">No categories found.</p>}
            </div>
          </div>
        )}

        {activeView === "products" && (
          <div className="bg-[#1a0b2e]/40 border border-[#D4AF37]/15 rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-xl font-bold text-emerald-400 mb-6">Manage Products</h2>
            <div className="space-y-4">
              {collections.flatMap(c => c.items.map(item => ({ ...item, metal: c.metal, category: c.category }))).map((product) => (
                <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0c0418] border border-[#D4AF37]/10 rounded-xl gap-4">
                  <div className="flex items-center gap-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/20" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                        <ImageIcon className="h-5 w-5 text-[#D4AF37]/50" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-md">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full">{product.metal}</span>
                        <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{product.category}</span>
                        <span className="text-xs text-[#F3E5AB]/60">{product.weight_g}g</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => {
                        setEditingProduct(product.id);
                        setForm({
                          metal: product.metal,
                          category: product.category,
                          name: product.name,
                          weight_g: String(product.weight_g),
                          making_charge_pct: String(product.making_charge_pct),
                          description: product.description || "",
                        });
                        setImagePreview(product.image || null);
                        setImageFile(null);
                        setShowUploadForm(true);
                        setActiveView("dashboard");
                      }}
                      className="p-2 hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Edit</span>
                    </button>
                    <button 
                      onClick={async () => {
                        const confirmDelete = window.confirm(`Are you sure you want to delete ${product.name}?`);
                        if (confirmDelete) {
                          await deleteProduct(product.id);
                          const newCols = await getCollections();
                          setCollections(newCols);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> <span className="text-xs font-bold sm:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {totalProducts === 0 && <p className="text-[#F3E5AB]/50 text-sm">No products found.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
