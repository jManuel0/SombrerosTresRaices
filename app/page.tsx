"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import { featuredProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import { TAG_CONFIG } from "@/lib/products";
import { cartStorageKey, createCartMessage, createWhatsAppUrl, formatPrice } from "@/lib/shop";
import type { CartItem } from "@/lib/shop";
import { useTheme } from "./theme-provider";

type TrustItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

const navLinks = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" }
];

const trustItems: TrustItem[] = [
  {
    title: "Envíos a todo Colombia",
    description: "Despachos cuidados desde el taller hasta la puerta de tu casa.",
    icon: <ShippingIcon />
  },
  {
    title: "Pago seguro",
    description: "Compra con tranquilidad y confirmación inmediata.",
    icon: <ShieldIcon />
  },
  {
    title: "WhatsApp 24/7",
    description: "Asesoría cercana para elegir tu pieza ideal.",
    icon: <WhatsAppIcon />
  }
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(cartStorageKey);
      if (savedCart) setCartItems(JSON.parse(savedCart) as CartItem[]);
    } catch {
      window.localStorage.removeItem(cartStorageKey);
    } finally {
      setHasLoadedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartMessage = useMemo(() => createCartMessage(cartItems, cartTotal), [cartItems, cartTotal]);

  function addToCart(product: Product, size: string) {
    setCartItems((current) => {
      const exists = current.some((item) => item.id === product.id && item.size === size);
      if (exists) return current.map((item) => item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1, size }];
    });
    setIsCartOpen(true);
  }

  function removeFromCart(productId: string, size: string) {
    setCartItems((current) =>
      current.map((item) => item.id === productId && item.size === size ? { ...item, quantity: item.quantity - 1 } : item)
             .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() { setCartItems([]); }

  return (
    <main className="min-h-screen bg-theme-base text-theme-primary">
      <Navbar cartCount={cartCount} isMenuOpen={isMenuOpen} onCartOpen={() => setIsCartOpen(true)} onMenuClose={() => setIsMenuOpen(false)} onMenuToggle={() => setIsMenuOpen((o) => !o)} />
      <Hero />
      <CatalogPreview onAddToCart={addToCart} />
      <TrustSection />
      <Footer />
      <CartPanel cartItems={cartItems} cartTotal={cartTotal} isOpen={isCartOpen} message={cartMessage} onClear={clearCart} onClose={() => setIsCartOpen(false)} onRemove={(id, size) => removeFromCart(id, size)} />
      <FloatingWhatsApp />
    </main>
  );
}

function Navbar({ cartCount, isMenuOpen, onCartOpen, onMenuClose, onMenuToggle }: Readonly<{
  cartCount: number; isMenuOpen: boolean; onCartOpen: () => void; onMenuClose: () => void; onMenuToggle: () => void;
}>) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-theme-muted bg-nav backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={onMenuClose}>
          <Image src="/logo.webp" alt="Sombreros Tres Raices" width={44} height={44} className="rounded-full object-cover" />
          <span className="font-serif text-xl font-bold tracking-wide text-brand-green">Sombreros Tres Raices</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.18em] text-theme-secondary md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-brand-terra">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Botón modo oscuro/claro */}
          <button
            type="button"
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            onClick={toggle}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-theme bg-theme-surface text-theme-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-theme-muted"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button type="button" aria-label="Abrir carrito"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-theme bg-theme-surface shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-terra"
            onClick={onCartOpen}
          >
            <Image src="/icons/carrito.svg" alt="Carrito" width={22} height={22} className="dark:invert" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-terra px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button type="button" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-theme bg-brand-green text-theme-light md:hidden"
            onClick={onMenuToggle}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-theme-muted bg-theme-surface px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="rounded-md px-3 py-3 text-sm font-bold uppercase tracking-[0.16em] text-theme-primary transition hover:bg-theme-muted"
                onClick={onMenuClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3ebdd] dark:bg-[#0f1d17] transition-colors duration-300">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(196,154,58,0.12),transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(184,92,56,0.10),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_60%_40%,rgba(196,154,58,0.18),transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(184,92,56,0.15),transparent_50%)]" />

      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col items-center justify-center gap-8 px-5 pb-16 pt-20 sm:flex-row sm:items-center sm:px-8 lg:min-h-[88vh]">

        {/* Logo grande */}
        <div className="flex shrink-0 items-center justify-center">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#c49a3a]/30 shadow-[0_0_80px_rgba(196,154,58,0.20)] sm:h-72 sm:w-72 lg:h-80 lg:w-80"
            style={{ background: "radial-gradient(circle, rgba(196,154,58,0.06) 0%, transparent 70%)" }}
          >
            <div className="absolute inset-2 rounded-full border border-[#c49a3a]/20" />
            <Image
              src="/hero.png"
              alt="Logo Sombreros Tres Raices"
              fill
              priority
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px"
              className="object-contain p-8 dark:invert"
            />
          </div>
        </div>

        {/* Texto */}
        <div className="max-w-xl text-center text-[#14221b] dark:text-[#fffaf1] sm:text-left">
          <p className="mb-4 inline-flex border-l-2 border-[#c49a3a] pl-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#b85c38] dark:text-[#e8c96d] sm:tracking-[0.28em]">
            Hechos a mano en Colombia
          </p>
          <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Sombreros<br />Tres Raices
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#315c48] dark:text-[#f7ead2] sm:text-xl">
            Piezas artesanales con fibra natural, presencia elegante y el carácter cálido de la tradición colombiana.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-[#c49a3a] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#102018] shadow-[0_18px_45px_rgba(16,32,24,0.18)] transition hover:-translate-y-1 hover:bg-[#e8c96d]"
            >
              Ver catálogo
            </Link>
            <a
              href={createWhatsAppUrl("Hola, quiero asesoría para elegir un sombrero artesanal.")}
              className="inline-flex items-center justify-center rounded-full border border-[#14221b]/50 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#14221b] transition hover:-translate-y-1 hover:bg-[#14221b] hover:text-[#fffaf1] dark:border-[#fffaf1]/70 dark:text-[#fffaf1] dark:hover:bg-[#fffaf1] dark:hover:text-[#173326]"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogPreview({ onAddToCart }: Readonly<{ onAddToCart: (product: Product, size: string) => void }>) {
  return (
    <section id="catalogo" className="bg-theme-surface px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-terra">Catálogo</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-theme-primary sm:text-5xl">Selección destacada</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-theme-secondary">
            Tres siluetas pensadas para ciudad, viaje y celebraciones. Cada sombrero combina presencia, comodidad y oficio artesanal.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/catalogo" className="inline-flex items-center justify-center rounded-full border border-theme bg-transparent px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-theme-primary transition hover:bg-brand-green hover:text-theme-light hover:border-brand-green">
            Ver todos los sombreros
          </Link>
        </div>
      </div>
    </section>
  );
}

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
        <Image src={src} alt={alt} width={900} height={1100} className="max-h-[90vh] w-auto object-contain" priority />
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

function ProductCard({ product, onAddToCart }: Readonly<{ product: Product; onAddToCart: (product: Product, size: string) => void }>) {
  const [current, setCurrent] = useState(0);
  const [size, setSize] = useState("");
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const { ref, inView } = useInView();
  const prev = () => setCurrent((i) => (i - 1 + product.images.length) % product.images.length);
  const next = () => setCurrent((i) => (i + 1) % product.images.length);

  return (
    <>
      {zoomSrc && <ImageZoomModal src={zoomSrc} alt={product.name} onClose={() => setZoomSrc(null)} />}
      <article
        ref={ref}
        className={`group overflow-hidden rounded-lg border border-theme bg-theme-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${inView ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-theme-muted">
          <button aria-label="Ampliar imagen" className="absolute inset-0 z-10 cursor-zoom-in" onClick={() => setZoomSrc(product.images[current])} />
          <Image src={product.images[current]} alt={`${product.name} - foto ${current + 1}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />

          {/* Icono zoom */}
          <span className="absolute bottom-10 right-3 z-20 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
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

          {product.images.length > 1 && (
            <>
              <button onClick={prev} aria-label="Foto anterior" className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">‹</button>
              <button onClick={next} aria-label="Foto siguiente" className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/80">›</button>
            </>
          )}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {product.images.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir a foto ${i + 1}`} className={`h-2 w-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          )}
          <span className="absolute right-3 top-3 z-20 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">{current + 1} / {product.images.length}</span>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-terra">{product.category}</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-theme-primary">{product.name}</h3>
          <p className="mt-3 text-sm leading-6 text-theme-secondary">{product.description}</p>
          <p className="mt-4 text-lg font-semibold text-brand-terra">{formatPrice(product.price)}</p>

          {/* Selector de talla */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-theme-secondary">Talla (contorno de cabeza)</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)}
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

          <button type="button"
            disabled={!size}
            className="mt-5 w-full rounded-full border border-brand-green bg-brand-green px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-theme-light transition hover:border-brand-terra hover:bg-brand-terra disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => size && onAddToCart(product, size)}
          >
            Añadir al carrito
          </button>
        </div>
      </article>
    </>
  );
}

function TrustSection() {
  return (
    <section id="nosotros" className="border-y border-theme bg-theme-muted px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {trustItems.map((item) => (
          <div key={item.title} className="flex gap-4 rounded-lg bg-theme-surface/75 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green text-brand-gold-2">
              {item.icon}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-theme-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-theme-secondary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CartPanel({ cartItems, cartTotal, isOpen, message, onClear, onClose, onRemove }: Readonly<{
  cartItems: CartItem[]; cartTotal: number; isOpen: boolean; message: string;
  onClear: () => void; onClose: () => void; onRemove: (productId: string, size: string) => void;
}>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-theme-surface px-5 py-6 shadow-2xl sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="Sombreros Tres Raices" width={40} height={40} className="rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-terra">Carrito</p>
              <h2 className="font-serif text-3xl font-bold text-theme-primary">Tu selección</h2>
            </div>
          </div>
          <button type="button" aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-theme text-theme-primary transition hover:bg-theme-muted"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-theme bg-theme-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-theme-primary">{item.name}</h3>
                      <p className="mt-1 text-sm text-theme-secondary">Talla: {item.size} · {item.quantity} unidad{item.quantity > 1 ? "es" : ""} x {formatPrice(item.price)}</p>
                    </div>
                    <button type="button"
                      className="rounded-full border border-theme px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-terra transition hover:bg-theme-muted"
                      onClick={() => onRemove(item.id, item.size)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="text-sm font-semibold text-brand-terra underline" onClick={onClear}>Vaciar carrito</button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-theme bg-theme-card p-6 text-theme-secondary">
              Tu carrito está vacío. Agrega un sombrero para enviar tu pedido por WhatsApp.
            </div>
          )}
        </div>

        <div className="border-t border-theme pt-5">
          <div className="flex items-center justify-between text-lg font-bold text-theme-primary">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <a href={createWhatsAppUrl(message)} className="mt-5 flex w-full items-center justify-center rounded-full bg-brand-green px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-theme-light transition hover:bg-brand-terra">
            Finalizar por WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a href={createWhatsAppUrl("Hola, quiero información sobre los sombreros artesanales de Sombreros Tres Raices.")}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4d] shadow-[0_12px_30px_rgba(15,29,23,0.32)] transition hover:-translate-y-1 hover:bg-brand-green"
    >
      <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={28} height={28} />
    </a>
  );
}

function Footer() {
  return (
    <footer id="contacto" className="bg-theme-dark px-5 py-10 text-theme-light sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.webp" alt="Sombreros Tres Raices" width={48} height={48} className="rounded-full object-cover" />
          <div>
            <p className="font-serif text-2xl font-bold">Sombreros Tres Raices</p>
            <p className="mt-1 text-sm text-theme-muted">Tradición artesanal colombiana para vestir con presencia.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-medium uppercase tracking-[0.16em] text-theme-muted">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-brand-gold-2">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/share/1BweGm7wmX/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25">
            <Image src="/icons/facebook.svg" alt="Facebook" width={22} height={22} />
          </a>
          <a href="https://www.instagram.com/tresraicessombreros?igsh=Z3IzcnIycnhuNzYx" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25">
            <Image src="/icons/instagram.svg" alt="Instagram" width={22} height={22} />
          </a>
          <a href={createWhatsAppUrl("Hola, quiero información sobre Sombreros Tres Raices.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25">
            <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={22} height={22} />
          </a>
        </div>
      </div>
    </footer>
  );
}

function ShippingIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.75h11v9.5H3zM14 10.25h3.8l3.2 3.55v3.45h-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 19.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25 19.25 6v5.25c0 4.25-2.85 7.95-7.25 9.5-4.4-1.55-7.25-5.25-7.25-9.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.75 12.1 2.15 2.15 4.65-4.8" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.2 19.15 6.35 15.8a7.6 7.6 0 1 1 2.9 2.65z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.35 8.8c.25 3.05 2.15 4.9 5.75 5.85l1.15-1.4-2.05-1.15-.85.8c-1.25-.48-2.13-1.28-2.65-2.4l.88-.92z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.75 3.75h2.6l2.1 11.05a2 2 0 0 0 1.97 1.63h7.86a2 2 0 0 0 1.93-1.48l1.28-4.75H7.1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 20.25h.01M17.25 20.25h.01" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.9">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
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
