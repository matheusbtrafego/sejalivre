"use client";

import { motion } from "framer-motion";
import { Heart, Copy, CheckCircle2, DollarSign, QrCode } from "lucide-react";
import { useState } from "react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38, delay, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
});

export default function PortalContribuirPage() {
  const [copied, setCopied] = useState(false);
  const pixKey = "11.222.333/0001-44"; // Fake CNPJ for MVP

  function handleCopy() {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <motion.div {...fade(0)}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Contribuir</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2, lineHeight: 1.5 }}>
          Sua generosidade permite que a obra de Deus continue avançando.
        </p>
      </motion.div>

      {/* PIX Card */}
      <motion.div {...fade(0.1)} style={{
        background: "#fff", borderRadius: 24, padding: "28px 24px",
        border: "1px solid #f3f4f6", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #10b981, #059669)" }} />
        
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <DollarSign size={28} color="#10b981" />
        </div>
        
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Dízimos e Ofertas via PIX</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Igreja Seja Livre - CNPJ: {pixKey}</p>
        
        {/* Fake QR Code skeleton */}
        <div style={{ width: 160, height: 160, border: "2px dashed #e5e7eb", borderRadius: 16, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
          <QrCode size={48} color="#d1d5db" />
        </div>

        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#374151", letterSpacing: "0.05em" }}>{pixKey}</span>
          <button onClick={handleCopy} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: copied ? "#ecfdf5" : "#e5e7eb", color: copied ? "#10b981" : "#4b5563", fontSize: 12, fontWeight: 600, transition: "all 0.2s"
          }}>
            {copied ? <><CheckCircle2 size={14}/> Copiado!</> : <><Copy size={14}/> Copiar</>}
          </button>
        </div>
        
        <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Heart size={12} color="#f97316" /> Deus ama quem dá com alegria
        </p>
      </motion.div>
    </div>
  );
}
