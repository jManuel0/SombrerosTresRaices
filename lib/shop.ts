import type { Product } from "./products";

export type CartItem = Product & {
  quantity: number;
  size: string;
};

export const whatsappNumber = "573104010930";
export const cartStorageKey = "sombreros-tres-raices-cart";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

export function formatPrice(price: number) {
  return currencyFormatter.format(price);
}

export function createWhatsAppUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createCartMessage(cartItems: CartItem[], cartTotal: number) {
  if (cartItems.length === 0) {
    return "Hola, quiero recibir asesoría sobre los sombreros de Sombreros Tres Raices.";
  }

  const productLines = cartItems
    .map((item) => `- ${item.quantity} x ${item.name} | Talla: ${item.size} (${formatPrice(item.price)} c/u)`)
    .join("\n");

  return [
    "Hola, quiero hacer este pedido en Sombreros Tres Raices:",
    productLines,
    `Total estimado: ${formatPrice(cartTotal)}`,
    "Mi nombre es:",
    "Ciudad de entrega:",
    "¿Me confirmas disponibilidad y tiempos de envío?"
  ].join("\n");
}
