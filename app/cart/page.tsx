"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState } from "react";
import Link from "next/link";

const initialCart = [
  {
    id: 1,
    name: "Premium Silk Dress",
    variant: "Red, M",
    price: 249.99,
    image: "/dummy-dress.jpg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Luxury Leather Bag",
    variant: "Black",
    price: 399.99,
    image: "/dummy-bag.jpg",
    quantity: 2,
  },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    if (coupon === "SAVE10") setDiscount(0.1);
    else setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 20;
  const discountAmount = subtotal * discount;
  const total = subtotal + estimatedTax + shipping - discountAmount;

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
                    <tr key={item.id} className="border-b">
                      <td className="py-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {/* Replace with actual image */}
                          <span className="text-xs text-muted-foreground">Image</span>
                        </div>
                        <span className="font-semibold">{item.name}</span>
                      </td>
                      <td className="py-4">{item.variant}</td>
                      <td className="py-4">₹{item.price.toLocaleString()}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 rounded bg-secondary text-primary"
                            onClick={() => handleQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button
                            className="px-2 py-1 rounded bg-secondary text-primary"
                            onClick={() => handleQuantity(item.id, 1)}
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
                          onClick={() => handleRemove(item.id)}
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="border p-2 rounded w-40"
                    />
                    <button
                      className="px-4 py-2 rounded bg-primary text-white font-semibold"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                    {discount > 0 && (
                      <span className="ml-2 text-green-600 font-medium">Coupon applied!</span>
                    )}
                  </div>
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
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                    </div>
                  )}
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
