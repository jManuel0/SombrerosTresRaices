export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "aguadeno-clasico",
    name: "Sombrero Aguadeño Clásico",
    category: "Tradicional",
    price: 189000,
    image: "https://picsum.photos/seed/tres-raices-aguadeno/720/840",
    description: "Una pieza liviana y sobria para uso diario, viajes y ocasiones especiales."
  },
  {
    id: "vueltiao-dorado",
    name: "Sombrero Vueltiao Dorado",
    category: "Ceremonial",
    price: 245000,
    image: "https://picsum.photos/seed/tres-raices-vueltiao/720/840",
    description: "Diseño con presencia artesanal, ideal para celebraciones y regalos memorables."
  },
  {
    id: "fedora-arcilla",
    name: "Fedora Artesanal Arcilla",
    category: "Urbano",
    price: 215000,
    image: "https://picsum.photos/seed/tres-raices-fedora/720/840",
    description: "Silueta contemporánea con acabado cálido para vestir con elegancia."
  },
  {
    id: "panama-cafe",
    name: "Sombrero Panamá Café",
    category: "Urbano",
    price: 229000,
    image: "https://picsum.photos/seed/tres-raices-panama/720/840",
    description: "Perfil fresco y refinado para clima cálido y looks de ciudad."
  },
  {
    id: "campesino-natural",
    name: "Sombrero Campesino Natural",
    category: "Tradicional",
    price: 159000,
    image: "https://picsum.photos/seed/tres-raices-campesino/720/840",
    description: "Inspirado en la tradición rural colombiana, resistente y de uso versátil."
  },
  {
    id: "ala-ancha-oro",
    name: "Sombrero Ala Ancha Oro",
    category: "Ceremonial",
    price: 269000,
    image: "https://picsum.photos/seed/tres-raices-ala-ancha/720/840",
    description: "Una pieza de alto impacto para eventos, fotografía y ocasiones importantes."
  }
];

export const featuredProducts = products.slice(0, 3);
