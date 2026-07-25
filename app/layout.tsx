import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sombreros Tres Raices",
    template: "%s | Sombreros Tres Raices"
  },
  description: "Sombreros artesanales colombianos con elegancia, tradición y envíos a todo Colombia.",
  keywords: ["sombreros colombianos", "sombreros artesanales", "sombreros vueltiaos", "Sombreros Tres Raices"],
  openGraph: {
    title: "Sombreros Tres Raices",
    description: "Tienda online de sombreros artesanales colombianos.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "https://picsum.photos/seed/sombreros-tres-raices-og/1200/630",
        width: 1200,
        height: 630,
        alt: "Sombreros artesanales de Sombreros Tres Raices"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

