"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { QrCode, Link as LinkIcon, Save, ArrowUpRight, Flame } from "lucide-react";
import Link from "next/link";

export default function QRCodePage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLink() {
      const { data, error } = await supabase
        .from("sl_configuracoes")
        .select("valor")
        .eq("chave", "app_link")
        .single();
      
      if (data) {
        setLink(data.valor);
      }
      setLoading(false);
    }
    fetchLink();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("sl_configuracoes")
      .upsert({ chave: "app_link", valor: link, atualizado_em: new Date().toISOString() }, { onConflict: "chave" });
    
    setSaving(false);
    if (!error) {
      alert("Link do QR Code atualizado com sucesso!");
    } else {
      alert("Erro ao salvar: " + error.message);
    }
  }

  const qrUrl = link ? `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(link)}` : "";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 60 }}>
      
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-5 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] gap-4">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
            <QrCode size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>Gerenciar QR Code</h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 2, fontWeight: 500 }}>Acesso rápido ao App da Igreja</p>
          </div>
        </div>
        
        <Link href="/qrcode" target="_blank" style={{ textDecoration: "none", width: "100%", maxWidth: "180px" }}>
          <button className="sl-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            <ArrowUpRight size={16} /> Modo Apresentação
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        
        {/* Formulário */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="sl-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Link de Destino</h2>
            <p style={{ fontSize: 13, color: "#6b7280" }}>Cole o link para onde o QR Code deve apontar neste domingo.</p>
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <LinkIcon size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input 
              className="sl-input" 
              style={{ paddingLeft: 40 }}
              placeholder="https://invenzi.page.link/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            className="sl-btn-primary" 
            onClick={handleSave} 
            disabled={saving || loading || !link}
            style={{ alignSelf: "flex-start" }}
          >
            <Save size={16} /> {saving ? "Salvando..." : "Salvar Link"}
          </button>
        </motion.div>

        {/* Preview do QR Code */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sl-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "#f8fafc" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Preview do QR Code</h3>
          
          <div style={{ padding: 12, background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: 16, width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyItems: "center" }}>
            {loading ? (
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "auto" }}>Carregando...</p>
            ) : qrUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={qrUrl} alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            ) : (
               <p style={{ fontSize: 13, color: "#9ca3af", margin: "auto" }}>Nenhum link configurado</p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f97316", background: "#fff7ed", padding: "6px 12px", borderRadius: 100 }}>
             <Flame size={14} />
             <span style={{ fontSize: 12, fontWeight: 600 }}>Atualiza em tempo real</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
