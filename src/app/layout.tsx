import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seja Livre — Sistema de Gestão",
  description: "Sistema de gestão da Igreja Seja Livre — Ministério de Libertação e Restauração",
  openGraph: {
    title: "Seja Livre — Sistema de Gestão",
    description: "Plataforma oficial de gestão, células e membresia do Ministério Seja Livre.",
    url: "https://sejalivre.nexusx6.com.br",
    siteName: "Igreja Seja Livre",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
