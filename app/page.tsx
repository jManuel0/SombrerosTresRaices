import Image from "next/image";
import type { ReactNode } from "react";

type Product = {
  name: string;
  price: string;
  image: string;
};

type TrustItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

const products: Product[] = [
  {
    name: "Sombrero Aguadeno Clasico",
    price: "$189.000 COP",
    image: "https://picsum.photos/seed/tres-raices-aguadeno/720/840"
  },
  {
    name: "Sombrero Vueltiao Dorado",
    price: "$245.000 COP",
    image: "https://picsum.photos/seed/tres-raices-vueltiao/720/840"
  },
  {
    name: "Fedora Artesanal Arcilla",
    price: "$215.000 COP",
    image: "https://picsum.photos/seed/tres-raices-fedora/720/840"
  }
];

const navLinks = [
  { label: "Catalogo", href: "#catalogo" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" }
];

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.75 3.75h2.6l2.1 11.05a2 2 0 0 0 1.97 1.63h7.86a2 2 0 0 0 1.93-1.48l1.28-4.75H7.1"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.25 20.25h.01M17.25 20.25h.01" />
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

const trustItems: TrustItem[] = [
  {
    title: "Envios a todo Colombia",
    description: "Despachos cuidados desde el taller hasta la puerta de tu casa.",
    icon: <ShippingIcon />
  },
  {
    title: "Pago seguro",
    description: "Compra con tranquilidad y confirmacion inmediata.",
    icon: <ShieldIcon />
  },
  {
    title: "WhatsApp 24/7",
    description: "Asesoria cercana para elegir tu pieza ideal.",
    icon: <WhatsAppIcon />
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf5ea] text-[#14221b]">
      <Navbar />
      <Hero />
      <CatalogPreview />
      <TrustSection />
      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d9c18e]/60 bg-[#fbf5ea]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#" className="font-serif text-xl font-bold tracking-wide text-[#173326]">
          Sombreros Tres Raices
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.18em] text-[#315c48] md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-[#b85c38]">
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Abrir carrito"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c49a3a] bg-[#fffaf1] text-[#173326] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#b85c38] hover:text-white"
        >
          <CartIcon />
        </button>
      </nav>
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

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 pb-16 pt-20 sm:px-8 lg:min-h-[82vh]">
        <div className="max-w-3xl text-[#fffaf1]">
          <p className="mb-5 inline-flex border-l-2 border-[#c49a3a] pl-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#e8c96d]">
            Hechos a mano en Colombia
          </p>
          <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
            Sombreros Tres Raices
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f7ead2] sm:text-xl">
            Piezas artesanales con fibra natural, presencia elegante y el caracter calido de la tradicion colombiana.
          </p>
          <a
            href="#catalogo"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-[#c49a3a] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#102018] shadow-[0_18px_45px_rgba(16,32,24,0.38)] transition hover:-translate-y-1 hover:bg-[#e8c96d]"
          >
            Ver catalogo
          </a>
        </div>
      </div>
    </section>
  );
}

function CatalogPreview() {
  return (
    <section id="catalogo" className="bg-[#fffaf1] px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b85c38]">Catalogo</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-[#14221b] sm:text-5xl">
              Seleccion destacada
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#315c48]">
            Tres siluetas pensadas para ciudad, viaje y celebraciones. Cada sombrero combina presencia, comodidad y oficio artesanal.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="group overflow-hidden rounded-lg border border-[#d9c18e] bg-[#fbf5ea] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#d8cfb7]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl font-bold text-[#14221b]">{product.name}</h3>
                <p className="mt-3 text-lg font-semibold text-[#b85c38]">{product.price}</p>
                <button
                  type="button"
                  className="mt-6 w-full rounded-full border border-[#173326] bg-[#173326] px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#fffaf1] transition hover:border-[#b85c38] hover:bg-[#b85c38]"
                >
                  Anadir al carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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

function Footer() {
  return (
    <footer id="contacto" className="bg-[#0f1d17] px-5 py-10 text-[#fffaf1] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl font-bold">Sombreros Tres Raices</p>
          <p className="mt-2 text-sm text-[#d9c18e]">Tradicion artesanal colombiana para vestir con presencia.</p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-medium uppercase tracking-[0.16em] text-[#d9c18e]">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-[#e8c96d]">
              {link.label}
            </a>
          ))}
        </div>

        <a href="https://wa.me/573104010930" className="text-sm font-semibold text-[#e8c96d]">
          WhatsApp: +57 310 401 0930
        </a>
      </div>
    </footer>
  );
}
