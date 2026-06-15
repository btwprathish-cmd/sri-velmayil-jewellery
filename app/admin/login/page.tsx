import { Suspense } from "react";
import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0c0418] flex items-center justify-center text-[#D4AF37]">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
