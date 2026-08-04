"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { products, TAG_CONFIG } from "@/lib/products";
import type { Tag } from "@/lib/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/products";
import { createWhatsAppUrl, formatPrice } from "@/lib/shop";
import { useTheme } from "@/app/theme-provider";

type Filter = "todos" | Tag;
type SortOption = "relevancia" | "precio-asc" | "precio-desc";

const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: "todos",           label: "Todos",           emoji: "🗂️" },
  { id: "mas-vendido",     label: "Más vendidos",    emoji: "🏆" },
  { id: "destacado",       label: "Destacados",      emoji: "⭐" },
  { id: "tradicional",     label: "Tradicionales",   emoji: "🎩" },
  { id: "nueva-coleccion", label: "Nueva colección", emoji: "🆕" },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "relevancia",  label: "Relevancia" },
  { id: "precio-asc",  label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
];

const SIZES = ["3 / 54 cm", "4 / 56 cm", "5 / 58 cm", "6 / 60 cm"];

// ─── Modal de zoom ─────────────────────────────────────────────────────────
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
        <Image
          src={src}
          alt={alt}
          width={900}
          height={1100}
          className="max-h-[90vh] w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}

// ─── Hook para animar al entrar en viewport ────────────────────────────────
function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// ─── Tarjeta de producto ───────────────────────────────────────────────────
function ProductCard({ product, index }: { product: (typeof products)[0]; index: number }) {
  const [current, setCurrent] = useState(0);
  const [size, setSize] = useState("");
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { ref, inView } = useInView();

  const prev = useCallback(() => setCurrent((i) => (i - 1 + product.images.length) % product.images.length), [product.images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % product.images.length), [product.images.length]);

  const delay = `delay-${Math.min(index * 100, 500)}`;

  const productUrl = `/catalogo/${product.id}`;

  function handleShareWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${siteUrl}${productUrl}`;
    const text = `¡Mira este sombrero artesanal! ${product.name} - ${formatPrice(product.price)}\n${url}`;
    window.open(createWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  }

  function handleCopyLink(e: React.MouseEvent) {
    e.preventDefault();
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${siteUrl}${productUrl}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  }

  return (
    <>
      {zoomSrc && (
        <ImageZoomModal
          src={zoomSrc}
          alt={product.name}
          onClose={() => setZoomSrc(null)}
        />
      )}
      <article
        ref={ref}
        className={`group overflow-hidden rounded-lg border border-theme bg-theme-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
          inView ? `animate-fade-in-up ${delay}` : "opacity-0"
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-theme-muted">
          {/* Imagen con cursor de zoom */}
          <button
            aria-label="Ampliar imagen"
            className="absolute inset-0 z-10 cursor-zoom-in"
            onClick={() => setZoomSrc(product.images[current])}
          />
          <Image
            src={product.images[current]}
            alt={`${product.name} - foto ${current + 1}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          {/* Icono de zoom */}
          <span className="absolute right-3 bottom-10 z-20 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6" />
            </svg>
          </span>

          {/* Badges */}
          {product.tags.length > 0 && (
            <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
              {product.tags.map((tag) => {
                const cfg = TAG_CONFIG[tag];
                return (
                  <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${cfg.color}`}>
                    <span>{cfg.emoji}</span><span>{cfg.label}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Contador */}
          <span className="absolute right-3 top-3 z-20 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {current + 1} / {product.images.length}
          </span>

          {/* Flechas */}
          {product.images.length > 1 && (
            <>
              <button onClick={prev} aria-label="Foto anterior" className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">‹</button>
              <button onClick={next} aria-label="Foto siguiente" className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">›</button>
            </>
          )}

          {/* Puntos */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {product.images.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir a foto ${i + 1}`} className={`h-2 w-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold text-theme-primary">{product.name}</h2>
          <p className="mt-3 text-sm leading-6 text-theme-secondary">{product.description}</p>

          {/* Precio con descuento */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-brand-terra">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-theme-secondary line-through">{formatPrice(product.originalPrice)}</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Badge de stock bajo */}
          {product.stock !== undefined && product.stock <= LOW_STOCK_THRESHOLD && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              ¡Últimas {product.stock} unidades!
            </p>
          )}

          {/* Selector de talla */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-theme-secondary">Talla (contorno de cabeza)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    size === s
                      ? "border-brand-green bg-brand-green text-theme-light"
                      : "border-theme bg-theme-surface text-theme-primary hover:border-brand-green"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!size && <p className="mt-1.5 text-xs text-brand-terra">Selecciona una talla</p>}
          </div>

          {/* Botón consultar WhatsApp */}
          <a
            href={size ? createWhatsAppUrl(`Hola, quiero información sobre el ${product.name} en talla ${size}.`) : "#"}
            onClick={(e) => { if (!size) e.preventDefault(); }}
            className={`mt-5 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-theme-light transition ${
              size ? "bg-brand-green hover:bg-brand-terra" : "cursor-not-allowed bg-brand-green opacity-50"
            }`}
          >
            Consultar por WhatsApp
          </a>

          {/* Fila inferior: Ver detalle + Compartir */}
          <div className="mt-3 flex items-center gap-2">
            {/* Ver detalle */}
            <Link
              href={productUrl}
              className="flex-1 flex items-center justify-center rounded-full border border-theme bg-theme-surface px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-theme-primary transition hover:bg-brand-green hover:text-theme-light hover:border-brand-green"
            >
              Ver detalle
            </Link>

            {/* Compartir WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Compartir en WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-primary transition hover:bg-[#1f7a4d] hover:border-[#1f7a4d] hover:text-white"
            >
              <Image src="/icons/whatsapp.svg" alt="Compartir en WhatsApp" width={16} height={16} />
            </button>

            {/* Copiar link */}
            <button
              type="button"
              onClick={handleCopyLink}
              title={copiedLink ? "¡Copiado!" : "Copiar link"}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                copiedLink
                  ? "border-brand-green bg-brand-green text-theme-light"
                  : "border-theme bg-theme-surface text-theme-primary hover:bg-theme-muted"
              }`}
            >
              {copiedLink ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
                </svg>
              )}
            </button>
          </div>
          {copiedLink && (
            <p className="mt-1.5 text-center text-xs font-semibold text-brand-green animate-fade-in">¡Copiado!</p>
          )}
        </div>
      </article>
    </>
  );
}

// ─── Página principal del catálogo ─────────────────────────────────────────
export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");
  const { theme, toggle } = useTheme();

  const filtered = (() => {
    // 1. Filtrar por tag
    let result = activeFilter === "todos" ? products : products.filter((p) => p.tags.includes(activeFilter));
    // 2. Filtrar por búsqueda
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    // 3. Ordenar
    if (sortBy === "precio-asc") return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "precio-desc") return [...result].sort((a, b) => b.price - a.price);
    return result;
  })();

  return (
    <main className="min-h-screen bg-theme-base text-theme-primary">
      {/* Header */}
      <header className="border-b border-theme-muted bg-nav backdrop-blur px-5 py-5 sm:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="Sombreros Tres Raices" width={40} height={40} className="rounded-full object-cover" />
            <span className="font-serif text-xl font-bold tracking-wide text-brand-green">Sombreros Tres Raices</span>
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
            <Link href="/" className="rounded-full border border-theme px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-theme-primary transition hover:bg-brand-green hover:text-theme-light hover:border-brand-green">
              Volver
            </Link>
          </div>
        </nav>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Título con animación */}
          <div className="flex items-center gap-4">
            <Image src="/logo.webp" alt="Sombreros Tres Raices" width={56} height={56} className="rounded-full object-cover shadow-md" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-terra">Catálogo completo</p>
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h1 className="font-serif text-5xl font-bold leading-tight text-theme-primary sm:text-6xl">
              Sombreros artesanales para cada ocasión
            </h1>
            <p className="text-base leading-7 text-theme-secondary">
              Cada pedido se confirma por WhatsApp antes del envío. Precios en COP.
            </p>
          </div>

          {/* Buscador y Ordenamiento */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Input de búsqueda */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-secondary pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar sombrero..."
                className="w-full rounded-full border border-theme bg-theme-surface py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition"
                aria-label="Buscar productos"
              />
            </div>

            {/* Select de ordenamiento */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-theme bg-theme-surface px-4 py-2.5 text-sm text-theme-primary focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition cursor-pointer"
              aria-label="Ordenar productos"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Filtros */}
          <div className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-brand-green bg-brand-green text-theme-light shadow-md"
                      : "border-theme bg-theme-surface text-theme-primary hover:border-brand-green hover:bg-theme-muted"
                  }`}
                >
                  <span>{filter.emoji}</span><span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteo */}
          <p className="mt-6 text-sm text-theme-secondary">
            {filtered.length === 0
              ? "Ningún sombrero coincide con este filtro."
              : `${filtered.length} sombrero${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Grid con animaciones escalonadas */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          ) : (
            <div className="mt-10 animate-fade-in rounded-lg border border-dashed border-theme bg-theme-card p-12 text-center text-theme-secondary">
              <p className="text-4xl">🎩</p>
              <p className="mt-4 font-serif text-xl font-bold text-theme-primary">Sin resultados</p>
              <p className="mt-2 text-sm">Prueba con otro filtro, búsqueda o explora todos los sombreros.</p>
              <button
                onClick={() => { setActiveFilter("todos"); setSearch(""); setSortBy("relevancia"); }}
                className="mt-5 rounded-full bg-brand-green px-6 py-2.5 text-sm font-bold text-theme-light transition hover:bg-brand-terra"
              >
                Ver todos
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

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
