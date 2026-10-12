"use client";
import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import type { Product } from "@/data/store-content";
type CartLine = { product: Product; size: string; quantity: number };
type CartState = { cart: CartLine[]; setCart: Dispatch<SetStateAction<CartLine[]>> };
const CartContext = createContext<CartState | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("El carrito requiere CartProvider");
  return value;
}
