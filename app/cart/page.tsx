"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";


export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantity = (id: number, delta: number) => {
    // Find all items with this id and update only the correct variant
    const items = cart.filter(i => i.id === id);
    if (items.length === 1) {
      updateQuantity(id, items[0].variant, delta);
    } else if (items.length > 1) {
      // If multiple, update only the one with matching variant in the row
      // This function should be called with both id and variant
      // So update the handler in the row below
    }
  };

  const handleRemove = (id: number) => {
    const items = cart.filter(i => i.id === id);
    if (items.length === 1) {
      removeFromCart(id, items[0].variant);
    } else if (items.length > 1) {
      // If multiple, remove only the one with matching variant in the row
      // This function should be called with both id and variant
    }
  };


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 20;
  const total = subtotal + estimatedTax + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Your Cart</h1>
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30">
          {cart.length === 0 ? (
            <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-3">Product</th>
                    <th className="py-3">Variant</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id + '-' + item.variant} className="border-b">
                      <td className="py-4 flex items-center gap-4">
                        <Link href={`/product/${item.id}`} className="block">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">Image</span>
                            )}
                          </div>
                        </Link>
                        <Link href={`/product/${item.id}`} className="font-semibold hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-4">{item.variant}</td>
                      <td className="py-4">₹{item.price.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 rounded bg-secondary text-primary"
                            onClick={() => updateQuantity(item.id, item.variant, -1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button
                            className="px-2 py-1 rounded bg-secondary text-primary"
                            onClick={() => updateQuantity(item.id, item.variant, 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                      <td className="py-4">
                        <button
                          className="px-3 py-1 rounded bg-destructive text-white"
                          onClick={() => removeFromCart(item.id, item.variant)}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start mt-8">
                <div className="space-y-4 w-full md:w-1/2">
                  {/* Coupon code removed from cart page. Use on checkout page only. */}
                  <Link href="/catalog" className="inline-block mt-4 text-primary underline">Continue shopping</Link>
                </div>
                <div className="bg-secondary/30 p-6 rounded-xl w-full md:w-1/2">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Estimated Tax</span>
                    <span>₹{estimatedTax.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                  </div>
                  {/* Discount removed from cart page. Use on checkout page only. */}
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span>₹{total.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                  </div>
                  <Link href="/checkout" className="block mt-6 w-full py-3 rounded bg-primary text-white font-bold text-lg text-center hover:bg-primary/90 transition">Proceed to checkout</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
