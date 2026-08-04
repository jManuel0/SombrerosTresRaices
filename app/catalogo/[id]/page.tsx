"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { products, TAG_CONFIG, LOW_STOCK_THRESHOLD } from "@/lib/products";
import { createWhatsAppUrl, formatPrice } from "@/lib/shop";
import { useTheme } from "@/app/theme-provider";

const SIZES = ["3 / 54 cm", "4 / 56 cm", "5 / 58 cm", "6 / 60 cm"];

// ─── Modal de zoom ──────────────────────────────────────────────────────────
function ImageZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="zoom-modal-enter fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        aria-label="Cerrar zoom"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={src} alt={alt} width={900} height={1100} className="max-h-[90vh] w-auto object-contain" priority />
      </div>
    </div>
  );
}

// ─── Iconos ─────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

// ─── Página de producto ─────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const product = products.find((p) => p.id === id);

  const [current, setCurrent] = useState(0);
  const [size, setSize] = useState("");
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { theme, toggle } = useTheme();

  // Construir URL de la página actual
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  if (!product) {
    notFound();
  }

  const prev = useCallback(() => setCurrent((i) => (i - 1 + product.images.length) % product.images.length), [product.images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % product.images.length), [product.images.length]);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const isLowStock = product.stock !== undefined && product.stock <= LOW_STOCK_THRESHOLD;

  function handleShareWhatsApp() {
    const text = `¡Mira este sombrero artesanal! ${product.name} - ${formatPrice(product.price)}\n${pageUrl}`;
    window.open(createWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  }

  function handleShareInstagram() {
    const text = `¡Mira este sombrero artesanal! ${product.name} - ${formatPrice(product.price)}\n${pageUrl}`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Texto copiado al portapapeles. Pégalo en Instagram para compartir.");
    });
    window.open("https://www.instagram.com/tresraicessombreros", "_blank", "noopener,noreferrer");
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }

  function handleConsultWhatsApp() {
    if (!size) return;
    const text = `Hola, quiero información sobre el ${product.name} en talla ${size}.\n\nPrecio: ${formatPrice(product.price)}\nPágina: ${pageUrl}`;
    window.open(createWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-theme-base text-theme-primary">
      {zoomSrc && <ImageZoomModal src={zoomSrc} alt={product.name} onClose={() => setZoomSrc(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-theme-muted bg-nav backdrop-blur px-5 py-4 sm:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="Sombreros Tres Raices" width={40} height={40} className="rounded-full object-cover" />
            <span className="hidden font-serif text-xl font-bold tracking-wide text-brand-green sm:inline">Sombreros Tres Raices</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              onClick={toggle}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-primary transition hover:bg-theme-muted"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              href="/catalogo"
              className="flex items-center gap-1.5 rounded-full border border-theme px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-theme-primary transition hover:bg-brand-green hover:text-theme-light hover:border-brand-green"
            >
              <ArrowLeftIcon />
              <span>Catálogo</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Contenido */}
      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">

          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-theme-secondary" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-terra transition">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-brand-terra transition">Catálogo</Link>
            <span>/</span>
            <span className="text-theme-primary font-semibold">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ─── Galería ─────────────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-theme-muted shadow-md">
                <button
                  aria-label="Ampliar imagen"
                  className="absolute inset-0 z-10 cursor-zoom-in"
                  onClick={() => setZoomSrc(product.images[current])}
                />
                <Image
                  src={product.images[current]}
                  alt={`${product.name} - foto ${current + 1}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition duration-500"
                />

                {/* Icono zoom */}
                <span className="absolute bottom-4 right-4 z-20 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm opacity-60 hover:opacity-100 transition">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
                  </svg>
                </span>

                {/* Contador */}
                <span className="absolute right-4 top-4 z-20 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                  {current + 1} / {product.images.length}
                </span>

                {/* Flechas */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Foto anterior"
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Foto siguiente"
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80"
                    >
                      <ChevronRightIcon />
                    </button>
                  </>
                )}

                {/* Puntos */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`Ir a foto ${i + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition ${i === current ? "bg-white scale-110" : "bg-white/40"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        i === current ? "border-brand-green" : "border-theme opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Info ─────────────────────────────────────────────────── */}
            <div className="flex flex-col">
              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => {
                    const cfg = TAG_CONFIG[tag];
                    return (
                      <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow ${cfg.color}`}>
                        <span>{cfg.emoji}</span><span>{cfg.label}</span>
                      </span>
                    );
                  })}
                </div>
              )}

              <h1 className="font-serif text-4xl font-bold text-theme-primary leading-tight sm:text-5xl">{product.name}</h1>

              <p className="mt-4 text-base leading-7 text-theme-secondary">{product.description}</p>

              {/* Precio */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-brand-terra">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-theme-secondary line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                      {discountPct}% off
                    </span>
                  </>
                )}
              </div>

              {/* Stock bajo */}
              {isLowStock && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 dark:bg-red-950 dark:text-red-400 w-fit">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse inline-block" />
                  ¡Últimas {product.stock} unidades!
                </p>
              )}

              {/* Selector de talla */}
              <div className="mt-6">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-theme-secondary">Talla (contorno de cabeza)</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                        size === s
                          ? "border-brand-green bg-brand-green text-theme-light shadow-md"
                          : "border-theme bg-theme-surface text-theme-primary hover:border-brand-green"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!size && <p className="mt-2 text-sm text-brand-terra">Selecciona una talla para continuar</p>}
              </div>

              {/* Botón principal WhatsApp */}
              <button
                type="button"
                disabled={!size}
                onClick={handleConsultWhatsApp}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-theme-light shadow-lg transition hover:bg-brand-terra disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} />
                Consultar por WhatsApp
                {size && <span className="opacity-80">· {size}</span>}
              </button>

              {/* Botones de compartir */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-theme bg-theme-surface px-3 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#1f7a4d] hover:text-white hover:border-[#1f7a4d]"
                  title="Compartir en WhatsApp"
                >
                  <Image src="/icons/whatsapp.svg" alt="" width={15} height={15} className="opacity-80" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-theme bg-theme-surface px-3 py-2.5 text-xs font-bold text-theme-primary transition hover:bg-[#e1306c] hover:text-white hover:border-[#e1306c]"
                  title="Compartir en Instagram"
                >
                  <Image src="/icons/instagram.svg" alt="" width={15} height={15} className="opacity-80" />
                  <span>Instagram</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-xs font-bold transition ${
                    copiedLink
                      ? "border-brand-green bg-brand-green text-theme-light"
                      : "border-theme bg-theme-surface text-theme-primary hover:bg-theme-muted"
                  }`}
                  title="Copiar link"
                >
                  {copiedLink ? (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
                      </svg>
                      <span>Copiar link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Volver al catálogo */}
              <div className="mt-8 pt-6 border-t border-theme">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-theme-secondary transition hover:text-brand-terra"
                >
                  <ArrowLeftIcon />
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
