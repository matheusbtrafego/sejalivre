"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import DynamicTopbar from "@/components/admin/DynamicTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7] relative w-full">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <DynamicTopbar setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
