import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGRO-RADAR 360",
  description: "Notícias do agronegócio em tempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
