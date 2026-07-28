"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products, TAG_CONFIG } from "@/lib/products";
import type { Tag } from "@/lib/products";
import { createWhatsAppUrl, formatPrice } from "@/lib/shop";

// ─── Filtros disponibles ───────────────────────────────────────────────────────
type Filter = "todos" | Tag;

const FILTERS: { id: Filter; label: string; emoji: string }[] = [
  { id: "todos",           label: "Todos",           emoji: "🗂️" },
  { id: "mas-vendido",     label: "Más vendidos",    emoji: "🏆" },
  { id: "destacado",       label: "Destacados",      emoji: "⭐" },
  { id: "tradicional",     label: "Tradicionales",   emoji: "🎩" },
  { id: "nueva-coleccion", label: "Nueva colección", emoji: "🆕" },
];

// ─── Tarjeta de producto ───────────────────────────────────────────────────────
function ProductCard({ product }: { product: (typeof products)[0] }) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((i) => (i - 1 + product.images.length) % product.images.length);
  const next = () =>
    setCurrent((i) => (i + 1) % product.images.length);

  return (
    <article className="group overflow-hidden rounded-lg border border-[#d9c18e] bg-[#fbf5ea] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Galería */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#d8cfb7]">
        <Image
          src={product.images[current]}
          alt={`${product.name} - foto ${current + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Badges de etiquetas */}
        {product.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.tags.map((tag) => {
              const cfg = TAG_CONFIG[tag];
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${cfg.color}`}
                >
                  <span>{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </span>
              );
            })}
          </div>
        )}

        {/* Contador */}
        <span className="absolute right-3 top-3 rounded-full bg-[#14221b]/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {current + 1} / {product.images.length}
        </span>

        {/* Flechas */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-[#14221b]/60 p-2 text-white backdrop-blur-sm transition hover:bg-[#14221b]"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#14221b]/60 p-2 text-white backdrop-blur-sm transition hover:bg-[#14221b]"
            >
              ›
            </button>
          </>
        )}

        {/* Puntos indicadores */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir a foto ${i + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h2 className="font-serif text-2xl font-bold text-[#14221b]">
          {product.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#315c48]">
          {product.description}
        </p>
        <p className="mt-4 text-lg font-semibold text-[#b85c38]">
          {formatPrice(product.price)}
        </p>
        <a
          href={createWhatsAppUrl(`Hola, quiero información sobre el ${product.name}.`)}
          className="mt-6 flex w-full items-center justify-center rounded-full bg-[#173326] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#fffaf1] transition hover:bg-[#b85c38]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}

// ─── Página principal del catálogo ────────────────────────────────────────────
export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("todos");

  const filtered =
    activeFilter === "todos"
      ? products
      : products.filter((p) => p.tags.includes(activeFilter));

  return (
    <main className="min-h-screen bg-[#fffaf1] text-[#14221b]">
      {/* Header */}
      <header className="border-b border-[#d9c18e]/70 bg-[#fbf5ea] px-5 py-5 sm:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-wide text-[#173326]"
          >
            Sombreros Tres Raices
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#173326] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#173326] transition hover:bg-[#173326] hover:text-[#fffaf1]"
          >
            Volver
          </Link>
        </nav>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Título */}
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b85c38]">
            Catálogo completo
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h1 className="font-serif text-5xl font-bold leading-tight text-[#14221b] sm:text-6xl">
              Sombreros artesanales para cada ocasión
            </h1>
            <p className="text-base leading-7 text-[#315c48]">
              Cada pedido se confirma por WhatsApp antes del envío. Precios en COP.
            </p>
          </div>

          {/* Barra de filtros */}
          <div className="mt-10 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-[#173326] bg-[#173326] text-[#fffaf1] shadow-md"
                      : "border-[#d9c18e] bg-[#fbf5ea] text-[#173326] hover:border-[#173326] hover:bg-[#e8dcc6]"
                  }`}
                >
                  <span>{filter.emoji}</span>
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteo de resultados */}
          <p className="mt-6 text-sm text-[#315c48]">
            {filtered.length === 0
              ? "Ningún sombrero coincide con este filtro."
              : `${filtered.length} sombrero${filtered.length > 1 ? "s" : ""} encontrado${filtered.length > 1 ? "s" : ""}`}
          </p>

          {/* Grid de productos */}
          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-dashed border-[#d9c18e] bg-[#fbf5ea] p-12 text-center text-[#315c48]">
              <p className="text-4xl">🎩</p>
              <p className="mt-4 font-serif text-xl font-bold text-[#14221b]">Sin resultados</p>
              <p className="mt-2 text-sm">Prueba con otro filtro o explora todos los sombreros.</p>
              <button
                onClick={() => setActiveFilter("todos")}
                className="mt-5 rounded-full bg-[#173326] px-6 py-2.5 text-sm font-bold text-[#fffaf1] transition hover:bg-[#b85c38]"
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
