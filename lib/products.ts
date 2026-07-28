export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
};

export const products: Product[] = [
  {
    id: "sombrero-vallenato-colombia",
    name: "Sombrero Vallenato Colombia",
    category: "Tendencia",
    price: 49999,
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
    category: "Tradicional",
    price: 49999,
    images: [
      "/catalogo/sombrero-vallenato-tradicional/imagen1.webp",
      "/catalogo/sombrero-vallenato-tradicional/imagen2.webp",
      "/catalogo/sombrero-vallenato-tradicional/imagen3.webp",
    ],
    description: "Diseño clásico de la colección Vallenato Tradicional, símbolo de la cultura y el folclor colombiano."
  }
];

export const featuredProducts = products.slice(0, 3);
