import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/shop", label: "Boutique" },
  { href: "/marque", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <span className="text-foreground tracking-[0.4em] text-[0.55rem] leading-none">
        • • •
      </span>
      <span className="font-sans text-[0.75rem] tracking-[0.25em] uppercase font-semibold leading-none">
        216 Avenue Louis XIV
      </span>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b border-foreground/5">
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="w-1/3 flex justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-foreground hover:opacity-70 transition-opacity"
              aria-label="Ouvrir le menu"
            >
              <Menu size={20} />
            </button>
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.65rem] uppercase tracking-widest font-medium hover:opacity-50 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="w-1/3 flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="w-1/3 flex justify-end">
            <button
              onClick={openCart}
              className="relative group flex items-center hover:opacity-70 transition-opacity"
              aria-label="Panier"
            >
              <span className="text-[0.65rem] uppercase tracking-widest font-medium hidden md:block mr-2">
                Panier
              </span>
              <div className="relative">
                <ShoppingBag size={17} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-foreground text-background text-[0.5rem] font-bold w-3.5 h-3.5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="px-6 h-16 flex items-center justify-between border-b border-foreground/5">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-foreground hover:opacity-70 transition-opacity"
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-12 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl uppercase tracking-widest font-medium hover:opacity-50 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
