"use client";
// Remove top-level updateQuantity and removeFromCart

import React, { createContext, useContext, useState, useEffect } from "react";
// ...existing code...
// useState must be inside CartProvider
// ...existing code...

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, variant: string, delta: number) => void;
  removeFromCart: (id: string, variant: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);


export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQuantity = (id: string, variant: string, delta: number) => {
    setCart((prev: CartItem[]) =>
      prev.map((i: CartItem) =>
        i.id === id && i.variant === variant
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const removeFromCart = (id: string, variant: string) => {
    setCart((prev: CartItem[]) => prev.filter((i: CartItem) => !(i.id === id && i.variant === variant)));
  };

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));

    // Listen for cartUpdated event to sync cart state
    const handleCartUpdated = () => {
      const updated = localStorage.getItem("cart");
      if (!updated || updated === "[]") {
        setCart([]);
      } else {
        setCart(JSON.parse(updated));
      }
    };
    globalThis.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      globalThis.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.id === item.id && i.variant === item.variant
      );
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.variant === item.variant
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const clearCart = () => setCart([]);

  const contextValue = React.useMemo(() => ({
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }), [cart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
