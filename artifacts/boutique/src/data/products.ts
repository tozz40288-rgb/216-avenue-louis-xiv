export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
  sizes: string[];
  category: string;
  genre: "homme" | "femme" | "unisexe";
  image?: string;
}

export const products: Product[] = [
  {
    id: "tshirt-homme-noir",
    name: "T-shirt Homme Noir",
    description: "T-shirt full oversize 216 avenue Louis XIV. Coupe ample et déstructurée, coton premium 240g. Patch brodé signature sur la poitrine.",
    price: 49,
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "homme",
    image: "/products/tshirt-homme-noir.jpeg",
  },
  {
    id: "tshirt-homme-blanc",
    name: "T-shirt Homme Blanc",
    description: "T-shirt oversize 216 avenue Louis XIV. Coton premium 240g, inscription manuscrite signature sur la face avant.",
    price: 49,
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "homme",
    image: "/products/tshirt-homme-blanc.jpeg",
  },
  {
    id: "tshirt-femme-marron",
    name: "T-shirt Femme Marron",
    description: "T-shirt oversize 216 avenue Louis XIV. Coupe féminine déstructurée, coton doux 220g. Inscription signature sur la poitrine.",
    price: 49,
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
    image: "/products/tshirt-femme-marron.jpeg",
  },
  {
    id: "tshirt-femme-blanc-label",
    name: "T-shirt Femme Blanc Label",
    description: "T-shirt crop oversize 216 avenue Louis XIV. Coupe courte et large, coton premium, patch signature discret sur la poitrine.",
    price: 49,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
    image: "/products/tshirt-femme-blanc-label.jpeg",
  },
  {
    id: "tshirt-femme-blanc-texte",
    name: "T-shirt Femme Blanc Texte",
    description: "T-shirt crop oversize 216 avenue Louis XIV. Inscription signature en façade, coupe courte et ample, coton premium.",
    price: 49,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
    image: "/products/tshirt-femme-blanc-texte.jpeg",
  },
  {
    id: "tshirt-femme-noir",
    name: "T-shirt Femme Noir",
    description: "T-shirt crop oversize 216 avenue Louis XIV. Coloris noir signature, coupe courte et large, inscription blanche sur la poitrine.",
    price: 49,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
    image: "/products/tshirt-femme-noir.jpeg",
  },
  {
    id: "tshirt-femme-blanc-noir",
    name: "T-shirt Femme Blanc Patch Noir",
    description: "T-shirt crop oversize 216 avenue Louis XIV. Patch noir signature sur la poitrine, coton premium, coupe courte et féminine.",
    price: 49,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "femme",
    image: "/products/tshirt-femme-blanc-noir.jpeg",
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
    image: "/products/hoodie-homme-noir.jpg",
  },
  {
    id: "crewneck",
    name: "Pull sans Capuche",
    description: "Crewneck full oversize 216 avenue Louis XIV. Sweat molletonné épais, col rond, inscription signature sur la poitrine.",
    price: 79,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Haut",
    genre: "homme",
    image: "/products/crewneck-homme-noir.png",
  },
  {
    id: "jogging",
    name: "Bas de Survêtement",
    description: "Bas de survêtement full oversize. Tissu lourd gratté, élastique renforcé, poches latérales.",
    price: 79,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Bas",
    genre: "homme",
    image: "/products/jogging-homme-beige.jpg",
  },
  {
    id: "short-noir",
    name: "Short Noir",
    description: "Short oversize 216 avenue Louis XIV. Coupe large, longueur mi-cuisse, inscription signature sur la cuisse, cordon de serrage.",
    price: 59,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Bas",
    genre: "homme",
    image: "/products/short-homme-noir.jpg",
  },
  {
    id: "short-bleu",
    name: "Short Irisé Bleu",
    description: "Short irisé 216 avenue Louis XIV. Tissu technique réfléchissant, coupe large, inscription signature, cordon de serrage.",
    price: 69,
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Bas",
    genre: "homme",
    image: "/products/short-homme-bleu.jpg",
  },
  {
    id: "bonnet",
    name: "Bonnet",
    description: "Bonnet en maille côtelée. Patch signature brodé, matière douce stretch.",
    price: 29,
    sizes: ["Unique"],
    category: "Accessoire",
    genre: "unisexe",
    image: "/products/bonnet-noir.jpg",
  },
  {
    id: "casquette",
    name: "Casquette",
    description: "Casquette 6 panneaux. Patch cuir signature, fermeture réglable, visière structurée.",
    price: 35,
    sizes: ["Unique"],
    category: "Accessoire",
    genre: "unisexe",
    image: "/products/casquette-noir.jpg",
  },
];

export function formatPrice(price: number): string {
  return `${price} €`;
}
