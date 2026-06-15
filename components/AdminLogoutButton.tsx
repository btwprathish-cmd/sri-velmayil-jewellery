"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors"
    >
      <LogOut className="h-4 w-4" /> Logout
    </button>
  );
}
