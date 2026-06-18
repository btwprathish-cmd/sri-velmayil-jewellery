import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Award, Plus, X, Lock, Loader2, ArrowRight } from "lucide-react";
import { login } from "@/utils/auth";
import { BRAND } from "@/utils/brand";

export default function CollectionsPage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowAdminLogin(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowAdminLogin(false);
    }
  }

  function openModal() {
    setUsername("");
    setPassword("");
    setError("");
    setShowAdminLogin(true);
  }

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(username, password);
    if (result.success) {
      setShowAdminLogin(false);
      setLocation("/admin/dashboard");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 mb-4">
          <Award className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">BIS 916 Hallmarked Gold</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
          Our Jewellery Collections
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#F3E5AB]/70 max-w-2xl mx-auto font-sans">
          Explore our curated, hand-crafted designs. From light-weight daily wear to heavy traditional Tamil bridal ornaments.
        </p>

        <button
          onClick={openModal}
          aria-label="Admin Login"
          className="absolute top-0 right-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#D4AF37]/25 text-[#D4AF37]/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link
          href="/jewellery-collections/gold"
          className="group relative rounded-2xl overflow-hidden border border-[#D4AF37]/25 hover:border-[#D4AF37]/55 transition-all duration-300 shadow-xl flex flex-col"
          style={{ minHeight: "340px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
            alt="Gold Jewellery Collections"
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0418]/95 via-[#0c0418]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">22K · 24K · 18K</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">Gold Collections</h2>
            <p className="text-sm text-[#F3E5AB]/75 font-sans mb-5 max-w-xs leading-relaxed">
              Rings, chains, earrings, bangles, coins and anklets — all hallmarked 916 BIS certified pure gold.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-[#D4AF37] group-hover:text-[#F3E5AB] transition-colors">
              Explore Gold
              <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        <Link
          href="/jewellery-collections/silver"
          className="group relative rounded-2xl overflow-hidden border border-white/15 hover:border-white/35 transition-all duration-300 shadow-xl flex flex-col"
          style={{ minHeight: "340px" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#2a2a4e] to-[#0f0f1e]" />
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 40%, rgba(192,192,215,0.6) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(160,160,200,0.35) 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-white/80" />
              <span className="text-xs font-bold text-white/65 uppercase tracking-widest">Purity 99.9%</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">Silver Collections</h2>
            <p className="text-sm text-white/68 font-sans mb-5 max-w-xs leading-relaxed">
              Fine silver ornaments, auspicious articles, and investment coins — priced at today's live silver rate.
            </p>
            <span className="inline-flex items-center text-sm font-bold text-white/80 group-hover:text-white transition-colors">
              Explore Silver
              <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>

      {showAdminLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={handleOverlayClick}
        >
          <div
            ref={modalRef}
            className="w-full max-w-md bg-[#1a0b2e] border border-[#D4AF37]/25 rounded-2xl p-8 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-[#F3E5AB]/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-[#D4AF37]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
                Admin Login
              </h2>
              <p className="text-xs text-[#F3E5AB]/60 mt-1">{BRAND.name} Management Portal</p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
