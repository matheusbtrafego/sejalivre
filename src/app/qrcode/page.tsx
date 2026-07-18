"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function QRCodePresentationPage() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLink() {
      const { data } = await supabase
        .from("sl_configuracoes")
        .select("valor")
        .eq("chave", "app_link")
        .single();
      
      if (data) setLink(data.valor);
      setLoading(false);
    }
    
    fetchLink();

    // In a real app, we could listen to real-time Supabase changes here
    // so if the admin updates the link, the screen updates automatically.
    const channel = supabase
      .channel('public:sl_configuracoes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sl_configuracoes' }, payload => {
        if (payload.new && (payload.new as any).chave === 'app_link') {
          setLink((payload.new as any).valor);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>Carregando...</div>;
  }

  const qrUrl = link ? `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(link)}` : "";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)", color: "#fff", position: "relative" }}>
      
      {/* Botão voltar discreto */}
      <Link href="/admin/qrcode" style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Voltar
      </Link>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", marginBottom: 24 }}>
            <Flame size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>Seja Livre</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 40 }}>Aponte a câmera para acessar o aplicativo</p>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} style={{ padding: 16, background: "#fff", borderRadius: 32, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          {qrUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrUrl} alt="QR Code" style={{ width: 280, height: 280, display: "block", borderRadius: 16 }} />
          ) : (
            <div style={{ width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", background: "#f8fafc", borderRadius: 16 }}>
              Nenhum link ativo
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
