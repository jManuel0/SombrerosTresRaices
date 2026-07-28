"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { featuredProducts } from "@/lib/products";
import type { Product } from "@/lib/products";
import { cartStorageKey, createCartMessage, createWhatsAppUrl, formatPrice } from "@/lib/shop";
import type { CartItem } from "@/lib/shop";

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

      if (savedCart) {
        setCartItems(JSON.parse(savedCart) as CartItem[]);
      }
    } catch {
      window.localStorage.removeItem(cartStorageKey);
    } finally {
      setHasLoadedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartMessage = useMemo(() => createCartMessage(cartItems, cartTotal), [cartItems, cartTotal]);

  function addToCart(product: Product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function removeFromCart(productId: string) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <main className="min-h-screen bg-[#fbf5ea] text-[#14221b]">
      <Navbar
        cartCount={cartCount}
        isMenuOpen={isMenuOpen}
        onCartOpen={() => setIsCartOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        onMenuToggle={() => setIsMenuOpen((isOpen) => !isOpen)}
      />
      <Hero />
      <CatalogPreview onAddToCart={addToCart} />
      <TrustSection />
      <Footer />
      <CartPanel
        cartItems={cartItems}
        cartTotal={cartTotal}
        isOpen={isCartOpen}
        message={cartMessage}
        onClear={clearCart}
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
      />
      <FloatingWhatsApp />
    </main>
  );
}

function Navbar({
  cartCount,
  isMenuOpen,
  onCartOpen,
  onMenuClose,
  onMenuToggle
}: {
  cartCount: number;
  isMenuOpen: boolean;
  onCartOpen: () => void;
  onMenuClose: () => void;
  onMenuToggle: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d9c18e]/60 bg-[#fbf5ea]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-serif text-xl font-bold tracking-wide text-[#173326]" onClick={onMenuClose}>
          Sombreros Tres Raices
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.18em] text-[#315c48] md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-[#b85c38]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Abrir carrito"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#c49a3a] bg-[#fffaf1] text-[#173326] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#b85c38] hover:text-white"
            onClick={onCartOpen}
          >
            <CartIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b85c38] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9c18e] bg-[#173326] text-[#fffaf1] md:hidden"
            onClick={onMenuToggle}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-[#d9c18e]/60 bg-[#fffaf1] px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#173326] transition hover:bg-[#e8dcc6]"
                onClick={onMenuClose}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="https://picsum.photos/seed/sombreros-tres-raices-hero/1800/1100"
        alt="Sombrero artesanal colombiano sobre una mesa de taller"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1d17]/90 via-[#173326]/68 to-[#6f3927]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(196,154,58,0.36),transparent_34%),linear-gradient(135deg,rgba(184,92,56,0.25)_0%,rgba(251,245,234,0)_48%,rgba(20,34,27,0.30)_100%)]" />

      <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-center px-5 pb-16 pt-20 sm:px-8 lg:min-h-[82vh]">
        <div className="max-w-3xl text-[#fffaf1]">
          <p className="mb-5 inline-flex border-l-2 border-[#c49a3a] pl-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#e8c96d] sm:tracking-[0.28em]">
            Hechos a mano en Colombia
          </p>
          <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Sombreros Tres Raices
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f7ead2] sm:text-xl">
            Piezas artesanales con fibra natural, presencia elegante y el carácter cálido de la tradición colombiana.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-[#c49a3a] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#102018] shadow-[0_18px_45px_rgba(16,32,24,0.38)] transition hover:-translate-y-1 hover:bg-[#e8c96d]"
            >
              Ver catálogo
            </Link>
            <a
              href={createWhatsAppUrl("Hola, quiero asesoría para elegir un sombrero artesanal.")}
              className="inline-flex items-center justify-center rounded-full border border-[#fffaf1]/70 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#fffaf1] transition hover:-translate-y-1 hover:bg-[#fffaf1] hover:text-[#173326]"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogPreview({ onAddToCart }: { onAddToCart: (product: Product) => void }) {
  return (
    <section id="catalogo" className="bg-[#fffaf1] px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b85c38]">Catálogo</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-[#14221b] sm:text-5xl">
              Selección destacada
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#315c48]">
            Tres siluetas pensadas para ciudad, viaje y celebraciones. Cada sombrero combina presencia, comodidad y oficio artesanal.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center rounded-full border border-[#173326] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#173326] transition hover:bg-[#173326] hover:text-[#fffaf1]"
          >
            Ver todos los sombreros
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((i) => (i - 1 + product.images.length) % product.images.length);
  const next = () =>
    setCurrent((i) => (i + 1) % product.images.length);

  return (
    <article className="group overflow-hidden rounded-lg border border-[#d9c18e] bg-[#fbf5ea] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#d8cfb7]">
        <Image
          src={product.images[current]}
          alt={`${product.name} - foto ${current + 1}`}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

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

        <span className="absolute right-3 top-3 rounded-full bg-[#14221b]/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
          {current + 1} / {product.images.length}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85c38]">{product.category}</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-[#14221b]">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#315c48]">{product.description}</p>
        <p className="mt-4 text-lg font-semibold text-[#b85c38]">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="mt-6 w-full rounded-full border border-[#173326] bg-[#173326] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#fffaf1] transition hover:border-[#b85c38] hover:bg-[#b85c38]"
          onClick={() => onAddToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </article>
  );
}

function TrustSection() {
  return (
    <section id="nosotros" className="border-y border-[#d9c18e] bg-[#e8dcc6] px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {trustItems.map((item) => (
          <div key={item.title} className="flex gap-4 rounded-lg bg-[#fffaf1]/75 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173326] text-[#e8c96d]">
              {item.icon}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#14221b]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#315c48]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CartPanel({
  cartItems,
  cartTotal,
  isOpen,
  message,
  onClear,
  onClose,
  onRemove
}: {
  cartItems: CartItem[];
  cartTotal: number;
  isOpen: boolean;
  message: string;
  onClear: () => void;
  onClose: () => void;
  onRemove: (productId: string) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-[#0f1d17]/55 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fffaf1] px-5 py-6 shadow-2xl sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b85c38]">Carrito</p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#14221b]">Tu selección</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9c18e] text-[#173326] transition hover:bg-[#e8dcc6]"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-[#d9c18e] bg-[#fbf5ea] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#14221b]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#315c48]">
                        {item.quantity} unidad{item.quantity > 1 ? "es" : ""} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-[#d9c18e] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#b85c38] transition hover:bg-[#f0dfcb]"
                      onClick={() => onRemove(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="text-sm font-semibold text-[#b85c38] underline" onClick={onClear}>
                Vaciar carrito
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#d9c18e] bg-[#fbf5ea] p-6 text-[#315c48]">
              Tu carrito está vacío. Agrega un sombrero para enviar tu pedido por WhatsApp.
            </div>
          )}
        </div>

        <div className="border-t border-[#d9c18e] pt-5">
          <div className="flex items-center justify-between text-lg font-bold text-[#14221b]">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <a
            href={createWhatsAppUrl(message)}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-[#173326] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#fffaf1] transition hover:bg-[#b85c38]"
          >
            Finalizar por WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={createWhatsAppUrl("Hola, quiero información sobre los sombreros artesanales de Sombreros Tres Raices.")}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-[0_12px_30px_rgba(15,29,23,0.32)] transition hover:-translate-y-1 hover:bg-[#173326]"
    >
      <WhatsAppIcon />
    </a>
  );
}

function Footer() {
  return (
    <footer id="contacto" className="bg-[#0f1d17] px-5 py-10 text-[#fffaf1] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl font-bold">Sombreros Tres Raices</p>
          <p className="mt-2 text-sm text-[#d9c18e]">Tradición artesanal colombiana para vestir con presencia.</p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-medium uppercase tracking-[0.16em] text-[#d9c18e]">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-[#e8c96d]">
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href={createWhatsAppUrl("Hola, quiero información sobre Sombreros Tres Raices.")}
          className="text-sm font-semibold text-[#e8c96d]"
        >
          WhatsApp: +57 310 401 0930
        </a>
      </div>
    </footer>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.75 3.75h2.6l2.1 11.05a2 2 0 0 0 1.97 1.63h7.86a2 2 0 0 0 1.93-1.48l1.28-4.75H7.1"
      />
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
