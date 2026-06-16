import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, TrendingUp, Image, LayoutDashboard, LogOut, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { getSession, logout } from "@/utils/auth";
import { fetchLatestRate, type LiveRateRecord } from "@/utils/rates";
import collectionsData from "@/data/collections.json";

const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860,
  gold22k_8g: 110880,
  silver_1g: 270,
  gold24k_1g: 15131,
  source: "fallback",
  fetchedAt: new Date().toISOString(),
};

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<{ authenticated: boolean; username: string | null } | null>(null);

  // Rate override form
  const [currentRate, setCurrentRate] = useState<LiveRateRecord>(FALLBACK_RATE);
  const [gold22k, setGold22k] = useState("");
  const [silver, setSilver] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      if (!s.authenticated) setLocation("/admin/login");
    });
    fetchLatestRate()
      .then((r) => {
        setCurrentRate(r);
        setGold22k(String(r.gold22k_1g));
        setSilver(String(r.silver_1g));
      })
      .catch(() => {
        setGold22k(String(FALLBACK_RATE.gold22k_1g));
        setSilver(String(FALLBACK_RATE.silver_1g));
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const handleRateOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gold22k_1g: Number(gold22k), silver_1g: Number(silver) }),
      });
      const data = await res.json() as { success?: boolean; error?: string; record?: LiveRateRecord };
      if (res.ok && data.success && data.record) {
        setCurrentRate(data.record);
        setSaveResult({ ok: true, msg: `Rate saved — 22K: ₹${data.record.gold22k_1g.toLocaleString("en-IN")}/g, Silver: ₹${data.record.silver_1g.toLocaleString("en-IN")}/g` });
      } else {
        setSaveResult({ ok: false, msg: data.error ?? "Failed to save rate." });
      }
    } catch {
      setSaveResult({ ok: false, msg: "Network error — could not save rate." });
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshRate = async () => {
    setSaveResult(null);
    try {
      const r = await fetchLatestRate();
      setCurrentRate(r);
      setGold22k(String(r.gold22k_1g));
      setSilver(String(r.silver_1g));
    } catch {/* ignore */}
  };

  if (!session) return (
    <div className="min-h-screen bg-[#0c0418] flex items-center justify-center text-[#D4AF37]">Loading...</div>
  );

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

        {/* Header */}
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

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        {/* ── Rate Override Form ────────────────────────────────────── */}
        <div className="bg-[#1a0b2e]/60 border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#D4AF37]">Today's Rate Override</h2>
              <p className="text-xs text-[#F3E5AB]/60 mt-1 font-sans">
                Correct today's board rate if the live API shows an incorrect value.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#F3E5AB]/40 uppercase tracking-wider mb-1">Current source</p>
              <span className="text-xs font-mono text-[#D4AF37]/70">{currentRate.source}</span>
            </div>
          </div>

          {/* Current live values display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "22K (live)", value: `₹${currentRate.gold22k_1g.toLocaleString("en-IN")}`, sub: "per gram" },
              { label: "22K 8g (live)", value: `₹${currentRate.gold22k_8g.toLocaleString("en-IN")}`, sub: "sovereign" },
              { label: "24K (live)", value: `₹${currentRate.gold24k_1g.toLocaleString("en-IN")}`, sub: "per gram" },
              { label: "Silver (live)", value: `₹${currentRate.silver_1g.toLocaleString("en-IN")}`, sub: "per gram" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-[#0c0418]/60 rounded-xl p-3 border border-[#D4AF37]/10 text-center">
                <p className="text-[10px] text-[#F3E5AB]/50 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-serif font-bold text-lg text-[#D4AF37]">{value}</p>
                <p className="text-[10px] text-[#F3E5AB]/40">{sub}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleRateOverride} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/80 uppercase tracking-wider mb-2">
                  22K Gold — ₹ per gram
                </label>
                <input
                  type="number"
                  min={1000}
                  max={200000}
                  step={1}
                  required
                  value={gold22k}
                  onChange={(e) => setGold22k(e.target.value)}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/25 rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
                  placeholder="e.g. 12085"
                />
                {gold22k && Number(gold22k) >= 1000 && (
                  <p className="text-xs text-[#F3E5AB]/50 mt-1.5 font-sans">
                    8g sovereign: ₹{(Number(gold22k) * 8).toLocaleString("en-IN")} &nbsp;·&nbsp;
                    24K: ₹{Math.round(Number(gold22k) / 0.916).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F3E5AB]/80 uppercase tracking-wider mb-2">
                  Silver — ₹ per gram
                </label>
                <input
                  type="number"
                  min={10}
                  max={50000}
                  step={1}
                  required
                  value={silver}
                  onChange={(e) => setSilver(e.target.value)}
                  className="w-full bg-[#0c0418] border border-[#D4AF37]/25 rounded-lg px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
                  placeholder="e.g. 214"
                />
                {silver && Number(silver) >= 10 && (
                  <p className="text-xs text-[#F3E5AB]/50 mt-1.5 font-sans">
                    1 kg: ₹{(Number(silver) * 1000).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>

            {saveResult && (
              <div className={`flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm font-sans ${saveResult.ok ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
                {saveResult.ok
                  ? <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  : <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                {saveResult.msg}
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#D4AF37]/10"
              >
                {saving ? "Saving…" : "Save Override"}
              </button>
              <button
                type="button"
                onClick={handleRefreshRate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D4AF37]/25 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37]/10 transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Reload Live Rate
              </button>
              <p className="text-[11px] text-[#F3E5AB]/40 font-sans ml-auto">
                Last fetched: {new Date(currentRate.fetchedAt).toLocaleTimeString("en-IN")}
              </p>
            </div>
          </form>
        </div>

        {/* Quick Actions */}
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
