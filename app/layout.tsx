import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sombreros-tres-raices.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sombreros Tres Raices",
    template: "%s | Sombreros Tres Raices"
  },
  description: "Sombreros artesanales colombianos con elegancia, tradición y envíos a todo Colombia.",
  keywords: ["sombreros colombianos", "sombreros artesanales", "sombreros vueltiaos", "Sombreros Tres Raices"],
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Sombreros Tres Raices",
    description: "Tienda online de sombreros artesanales colombianos.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/logo.webp",
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
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
