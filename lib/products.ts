export type Tag = "mas-vendido" | "destacado" | "tradicional" | "nueva-coleccion";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  tags: Tag[];
};

export const TAG_CONFIG: Record<Tag, { label: string; emoji: string; color: string }> = {
  "mas-vendido":      { label: "Más vendido",      emoji: "🏆", color: "bg-amber-500 text-white" },
  "destacado":        { label: "Destacado",         emoji: "⭐", color: "bg-[#b85c38] text-white" },
  "tradicional":      { label: "Tradicional",       emoji: "🎩", color: "bg-[#173326] text-[#e8c96d]" },
  "nueva-coleccion":  { label: "Nueva colección",   emoji: "🆕", color: "bg-emerald-600 text-white" },
};

export const products: Product[] = [
  {
    id: "sombrero-vallenato-colombia",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    tags: ["mas-vendido", "destacado"],
    images: [
      "/catalogo/sombrero-vallenato-colombia/imagen1.webp",
      "/catalogo/sombrero-vallenato-colombia/imagen2.webp",
      "/catalogo/sombrero-vallenato-colombia/imagen3.webp",
      "/catalogo/sombrero-vallenato-colombia/imagen4.webp",
      "/catalogo/sombrero-vallenato-colombia/imagen5.webp",
    ],
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-tradicional",
    name: "Sombrero Vallenato Tradicional",
    category: "Sombrero Vallenato Tradicional",
    price: 49999,
    tags: ["tradicional"],
    images: [
      "/catalogo/sombrero-vallenato-tradicional/imagen1.webp",
      "/catalogo/sombrero-vallenato-tradicional/imagen2.webp",
      "/catalogo/sombrero-vallenato-tradicional/imagen3.webp",
    ],
    description: "Diseño clásico de la colección Vallenato Tradicional, símbolo de la cultura y el folclor colombiano."
  },
  {
    id: "sombrero-vallenato-2",
    name: "Sombrero Vallenato 2",
    category: "Sombrero Vallenato 2",
    price: 49999,
    tags: ["destacado"],
    images: [
      "/catalogo/sombrero-vallenato-2/imagen1.webp",
      "/catalogo/sombrero-vallenato-2/imagen2.webp",
      "/catalogo/sombrero-vallenato-2/imagen3.webp",
      "/catalogo/sombrero-vallenato-2/imagen4.webp",
      "/catalogo/sombrero-vallenato-2/imagen5.webp",
      "/catalogo/sombrero-vallenato-2/imagen6.webp",
    ],
    description: "Pieza artesanal de la colección Vallenato 2, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-3",
    name: "Sombrero Vallenato Colombia 3",
    category: "Sombrero Vallenato Colombia 3",
    price: 49999,
    tags: ["nueva-coleccion"],
    images: [
      "/catalogo/sombrero-vallenato-colombia-3/imagen1.webp",
      "/catalogo/sombrero-vallenato-colombia-3/imagen2.webp",
      "/catalogo/sombrero-vallenato-colombia-3/imagen3.webp",
      "/catalogo/sombrero-vallenato-colombia-3/imagen4.webp",
    ],
    description: "Pieza artesanal de la colección Vallenato Colombia 3, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-blanco",
    name: "Sombrero Vallenato Colombia Blanco",
    category: "Sombrero Vallenato Colombia Blanco",
    price: 49999,
    tags: ["nueva-coleccion", "destacado"],
    images: [
      "/catalogo/sombrero-vallenato-colombia-blanco/imagen1.webp",
      "/catalogo/sombrero-vallenato-colombia-blanco/imagen2.webp",
      "/catalogo/sombrero-vallenato-colombia-blanco/imagen3.webp",
    ],
    description: "Pieza artesanal de la colección Vallenato Colombia Blanco, elaborada a mano con materiales naturales."
  }
];

export const featuredProducts = products.slice(0, 3);
