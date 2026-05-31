export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  sizes: string[];
  category: string;
  genre: "homme" | "femme" | "unisexe";
}

export const products: Product[] = [
  {
    id: "tshirt",
    name: "T-shirt",
    description: "T-shirt full oversize 216 avenue Louis XIV. Coupe ample et déstructurée, coton premium 240g.",
    price: 49,
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "unisexe",
  },
  {
    id: "hoodie",
    name: "Pull à Capuche",
    description: "Hoodie full oversize. Sweat molletonné épais, poche kangourou, capuche ajustable.",
    price: 89,
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "homme",
  },
  {
    id: "crewneck",
    name: "Pull sans Capuche",
    description: "Crewneck full oversize. Sweat molletonné épais, col rond, poignets renforcés.",
    price: 79,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
  },
  {
    id: "jogging",
    name: "Bas de Survêtement",
    description: "Bas de survêtement full oversize. Tissu lourd gratté, élastique renforcé, poches latérales.",
    price: 79,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Bas",
    genre: "homme",
  },
  {
    id: "short",
    name: "Short",
    description: "Short full oversize. Coupe large, longueur mi-cuisse, cordon de serrage.",
    price: 59,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Bas",
    genre: "femme",
  },
  {
    id: "bonnet",
    name: "Bonnet",
    description: "Bonnet en maille côtelée. Logo brodé discret, matière douce stretch.",
    price: 29,
    sizes: ["Unique"],
    category: "Accessoire",
    genre: "unisexe",
  },
  {
    id: "casquette",
    name: "Casquette",
    description: "Casquette 6 panneaux. Broderie logo, fermeture réglable, visière structurée.",
    price: 35,
    sizes: ["Unique"],
    category: "Accessoire",
    genre: "unisexe",
  },
];

export function formatPrice(price: number): string {
  return `${price} €`;
}
