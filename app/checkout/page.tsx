"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Forms */}
          <form className="col-span-2 bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="email" placeholder="Email" className="border p-3 rounded w-full" required />
                <input type="tel" placeholder="Phone" className="border p-3 rounded w-full" required />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="Country/Region" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="Address Line 1" className="border p-3 rounded w-full md:col-span-2" required />
                <input type="text" placeholder="Address Line 2 (optional)" className="border p-3 rounded w-full md:col-span-2" />
                <input type="text" placeholder="City" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="State/Province" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="Postal/ZIP Code" className="border p-3 rounded w-full" required />
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Save this address to my account</span>
                </label>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" defaultChecked />
                <span>Billing same as shipping</span>
              </label>
              {/* If unchecked, show billing address fields (not implemented for brevity) */}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="shipping" defaultChecked />
                  <span>Express (2-3 days) - ₹199.00</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="shipping" />
                  <span>Standard (5-7 days) - ₹99.00</span>
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" defaultChecked />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" />
                  <span>UPI</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <input type="text" placeholder="Cardholder Name" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="Card Number" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="Expiry Date (MM/YY)" className="border p-3 rounded w-full" required />
                <input type="text" placeholder="CVV" className="border p-3 rounded w-full" required />
              </div>
            </div>
            <div>
              <textarea placeholder="Order notes / instructions (optional)" className="border p-3 rounded w-full" rows={3} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" required />
                <span>I agree to <Link href="/terms" className="underline text-primary">Terms & Conditions</Link></span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Subscribe to newsletter</span>
              </label>
            </div>
            <button type="submit" className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition">Place Order</button>
          </form>
          {/* Right: Order Summary */}
          <div className="col-span-1 bg-secondary/30 p-6 rounded-xl shadow-lg border border-border/30">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <span className="text-xs text-muted-foreground">Image</span>
                </div>
                <div>
                  <div className="font-semibold">Premium Silk Dress</div>
                  <div className="text-muted-foreground text-sm">Red, M</div>
                  <div className="text-muted-foreground text-sm">Qty: 1</div>
                </div>
                <div className="font-bold">$249.99</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <span className="text-xs text-muted-foreground">Image</span>
                </div>
                <div>
                  <div className="font-semibold">Luxury Leather Bag</div>
                  <div className="text-muted-foreground text-sm">Black</div>
                  <div className="text-muted-foreground text-sm">Qty: 2</div>
                </div>
                <div className="font-bold">$799.98</div>
              </div>
            </div>
            <div className="mt-8 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$1049.97</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$20.00</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$83.99</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>$1153.96</span>
              </div>
            </div>
            <Link href="/cart" className="block mt-6 text-primary underline">Back to cart</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
