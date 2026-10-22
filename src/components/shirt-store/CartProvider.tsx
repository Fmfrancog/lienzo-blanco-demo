"use client";
import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { storeContent, type Product } from "@/data/store-content";
type CartLine = { product: Product; size: string; quantity: number };
type CartState = { cart: CartLine[]; setCart: Dispatch<SetStateAction<CartLine[]>> };
const CartContext = createContext<CartState | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("plur-cart-v1") || "[]");
      // Restore browser-only state after hydration; the server cannot read sessionStorage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setCart(saved.flatMap(line => {
        const product = storeContent.products.find(product => product.id === line.id);
        return product && (product.sizes || storeContent.sizes).includes(line.size) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 99 ? [{ product, size: line.size, quantity: line.quantity }] : [];
      }));
    } catch { /* Storage is optional for guest shopping. */ }
    setRestored(true);
  }, []);
  useEffect(() => {
    if (restored) try { sessionStorage.setItem("plur-cart-v1", JSON.stringify(cart.map(line => ({ id: line.product.id, size: line.size, quantity: line.quantity })))); } catch { /* Keep the in-memory cart available. */ }
  }, [cart, restored]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("El carrito requiere CartProvider");
  return value;
}
