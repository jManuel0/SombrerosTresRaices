"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products, TAG_CONFIG } from "@/lib/products";
import type { Tag } from "@/lib/products";
import { createWhatsAppUrl, formatPrice } from "@/lib/shop";
import { useTheme } from "@/app/theme-provider";

type Filter = "todos" | Tag;

const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: "todos",           label: "Todos",           emoji: "🗂️" },
  { id: "mas-vendido",     label: "Más vendidos",    emoji: "🏆" },
  { id: "destacado",       label: "Destacados",      emoji: "⭐" },
  { id: "tradicional",     label: "Tradicionales",   emoji: "🎩" },
  { id: "nueva-coleccion", label: "Nueva colección", emoji: "🆕" },
];

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + product.images.length) % product.images.length);
  const next = () => setCurrent((i) => (i + 1) % product.images.length);

  return (
    <article className="group overflow-hidden rounded-lg border border-theme bg-theme-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-theme-muted">
        <Image src={product.images[current]} alt={`${product.name} - foto ${current + 1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />

        {/* Badges */}
        {product.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
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
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {current + 1} / {product.images.length}
        </span>

        {/* Flechas */}
        {product.images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">‹</button>
            <button onClick={next} aria-label="Foto siguiente" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">›</button>
          </>
        )}

        {/* Puntos */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {product.images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir a foto ${i + 1}`} className={`h-2 w-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="font-serif text-2xl font-bold text-theme-primary">{product.name}</h2>
        <p className="mt-3 text-sm leading-6 text-theme-secondary">{product.description}</p>
        <p className="mt-4 text-lg font-semibold text-brand-terra">{formatPrice(product.price)}</p>
        <a href={createWhatsAppUrl(`Hola, quiero información sobre el ${product.name}.`)}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-theme-light transition hover:bg-brand-terra"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("todos");
  const { theme, toggle } = useTheme();

  const filtered = activeFilter === "todos"
    ? products
    : products.filter((p) => p.tags.includes(activeFilter));

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
            {/* Botón modo oscuro/claro */}
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
          {/* Título */}
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

          {/* Filtros */}
          <div className="mt-10 flex flex-wrap gap-2">
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

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-dashed border-theme bg-theme-card p-12 text-center text-theme-secondary">
              <p className="text-4xl">🎩</p>
              <p className="mt-4 font-serif text-xl font-bold text-theme-primary">Sin resultados</p>
              <p className="mt-2 text-sm">Prueba con otro filtro o explora todos los sombreros.</p>
              <button onClick={() => setActiveFilter("todos")}
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
