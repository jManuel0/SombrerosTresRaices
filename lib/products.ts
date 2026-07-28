export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  // Colección: Sombrero Vallenato Colombia
  {
    id: "sombrero-vallenato-colombia-1",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-colombia/imagen1.webp",
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-2",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-colombia/imagen2.webp",
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-3",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-colombia/imagen3.webp",
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-4",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-colombia/imagen4.webp",
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },
  {
    id: "sombrero-vallenato-colombia-5",
    name: "Sombrero Vallenato Colombia",
    category: "Sombrero Vallenato Colombia",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-colombia/imagen5.webp",
    description: "Pieza artesanal de la colección Vallenato Colombia, elaborada a mano con materiales naturales."
  },

  // Colección: Sombrero Vallenato Tradicional
  {
    id: "sombrero-vallenato-tradicional-1",
    name: "Sombrero Vallenato Tradicional",
    category: "Sombrero Vallenato Tradicional",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-tradicional/imagen1.webp",
    description: "Diseño clásico de la colección Vallenato Tradicional, símbolo de la cultura y el folclor colombiano."
  },
  {
    id: "sombrero-vallenato-tradicional-2",
    name: "Sombrero Vallenato Tradicional",
    category: "Sombrero Vallenato Tradicional",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-tradicional/imagen2.webp",
    description: "Diseño clásico de la colección Vallenato Tradicional, símbolo de la cultura y el folclor colombiano."
  },
  {
    id: "sombrero-vallenato-tradicional-3",
    name: "Sombrero Vallenato Tradicional",
    category: "Sombrero Vallenato Tradicional",
    price: 49999,
    image: "/catalogo/sombrero-vallenato-tradicional/imagen3.webp",
    description: "Diseño clásico de la colección Vallenato Tradicional, símbolo de la cultura y el folclor colombiano."
  }
];

export const featuredProducts = products.slice(0, 3);
