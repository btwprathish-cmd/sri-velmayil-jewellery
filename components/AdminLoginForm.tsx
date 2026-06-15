"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { BRAND } from "@/utils/brand";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const redirect = searchParams.get("redirect") || "/admin/dashboard";
      router.push(redirect);
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0418] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a0b2e]/80 border border-[#D4AF37]/25 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">
            Admin Login
          </h1>
          <p className="text-xs text-[#F3E5AB]/60 mt-2">{BRAND.name} Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#F3E5AB]/70 uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-[#0c0418] border border-[#D4AF37]/20 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-[#D4AF37] text-sm" />
          </div>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1a0b2e] font-bold rounded-lg uppercase tracking-wider text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
