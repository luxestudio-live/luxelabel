"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState, useEffect } from "react"; 

// Coupon type definition
interface Coupon {
  id: string;
  code: string;
  status: string;
  startDate?: string;
  endDate?: string;
  minValue?: number;
  type: "percent" | "flat" | "buy_get";
  percent?: number;
  amount?: number;
  buyQty?: number;
  getQty?: number;
}
import { useRouter } from "next/navigation";
import { useUser } from "@/app/user/UserContext";
import { useCart } from "@/app/cart/CartContext";

// Add Razorpay type to window for TypeScript
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
    // Shipping method state
    const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('express');
  const [coupon, setCoupon] = useState("");
  // discountPercent for percent/flat, discountAmount for buy_get
  // Removed unused discountPercent assignment per SonarQube
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleApplyCoupon = () => {
    if (couponApplied) {
      // Remove coupon
      setCouponApplied(false);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCoupon("");
      setCouponError("");
      return;
    }
    if (coupon.trim().length === 0) {
      setCouponError("Please enter a coupon code.");
      setDiscountAmount(0);
      return;
    }
    const found = activeCoupons.find(c => c.code.toLowerCase() === coupon.trim().toLowerCase() && c.status === "active");
    if (!found) {
      setDiscountAmount(0);
      setCouponError("Invalid or inactive coupon code.");
      return;
    }
    // Check validity dates
    const now = new Date();
    if (found.startDate && new Date(found.startDate) > now) {
      setDiscountAmount(0);
      setCouponError("Coupon not started yet.");
      return;
    }
    if (found.endDate && new Date(found.endDate) < now) {
      setDiscountAmount(0);
      setCouponError("Coupon expired.");
      return;
    }
    // Check min cart value
    if (found.minValue && subtotal < found.minValue) {
      setDiscountAmount(0);
      setCouponError(`Minimum cart value ₹${found.minValue} required.`);
      return;
    }
    // Apply discount
    let percent = 0;
    let amount = 0;
    if (found.type === "percent") {
      percent = (found.percent ?? 0) / 100;
      setDiscountAmount(subtotal * percent);
    } else if (found.type === "flat") {
      setDiscountAmount(found.amount ?? 0);
    } else if (found.type === "buy_get") {
      // Buy X Get Y Free logic
      const buyQty = found.buyQty ?? 0;
      const getQty = found.getQty ?? 0;
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
      if (buyQty === 0 || getQty === 0 || totalQty < buyQty) {
        setDiscountAmount(0);
        setCouponError(`Add at least ${buyQty} items to use this coupon.`);
        setFreeItemsMap({});
        return;
      }
      // Only complete sets of (buyQty + getQty) give free items
      const setSize = buyQty + getQty;
      const sets = Math.floor(totalQty / setSize);
      let freeQty = sets * getQty;
      // Flatten items to individual units for correct free item selection
      let unitList: { id: string; variant: string; price: number; }[] = [];
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          unitList.push({ id: item.id, variant: item.variant, price: item.price });
        }
      }
      unitList.sort((a, b) => a.price - b.price);
      // Mark only the cheapest freeQty units as free
      let freeValue = 0;
      // Debug: log unitList and freeQty
      if (typeof window !== "undefined") {
        console.log("unitList:", unitList);
        console.log("freeQty:", freeQty);
      }
      let freeMap: { [key: string]: number } = {};
      let marked = 0;
      for (let i = 0; i < unitList.length && marked < freeQty; i++) {
        freeValue += typeof unitList[i].price === 'number' ? unitList[i].price : Number(unitList[i].price);
        const key = unitList[i].id + '-' + unitList[i].variant;
        freeMap[key] = (freeMap[key] || 0) + 1;
        marked++;
      }
      setDiscountAmount(freeValue);
      setFreeItemsMap(freeMap);
    }
    setAppliedCoupon(found);
    setCouponApplied(true);
    setCouponError("");
  };

  // Track which items are free for buy_get
  const [freeItemsMap, setFreeItemsMap] = useState<{ [key: string]: number }>({});

  const handleCouponInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!couponApplied) {
      setCoupon(e.target.value);
      setCouponError("");
    }
  };

  const { cart } = useCart();
  const [buyNowItem, setBuyNowItem] = useState(null);

  useEffect(() => {
    // Fetch active coupons from Firestore
    async function fetchCoupons() {
      try {
        const { db } = await import("@/lib/firebaseClient");
        const { collection, getDocs } = await import("firebase/firestore");
        const snap = await getDocs(collection(db, "coupons"));
          setActiveCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
      } catch {}
    }
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }
    if (user) {
      setBuyNowItem(null);
      const stored = localStorage.getItem("buyNowItem");
      if (stored) {
        setBuyNowItem(JSON.parse(stored));
      }
      // Pre-fill form fields with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user, isLoading]);

  // Use buyNowItem if present, else cart
  const items = buyNowItem ? [buyNowItem] : cart;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Shipping fee based on selected method
  const shipping = shippingMethod === 'express' ? 199 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discountAmount;

  // ...existing code...
  // Form state for pre-filled fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: ""
  });
  // Field-level error state
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  // ...existing code...
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Forms */}
          <form className="col-span-2 bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30 space-y-8" onSubmit={e => e.preventDefault()}>
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="email" placeholder="Email" className="border p-3 rounded w-full" required value={formData.email} readOnly />
                  {fieldErrors.email && <div className="text-red-600 text-sm mt-1">{fieldErrors.email}</div>}
                </div>
                <div>
                  <input type="tel" placeholder="Phone" className="border p-3 rounded w-full" required value={formData.phone} readOnly />
                  {fieldErrors.phone && <div className="text-red-600 text-sm mt-1">{fieldErrors.phone}</div>}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="text" placeholder="Full Name" className="border p-3 rounded w-full" required value={formData.name} readOnly />
                  {fieldErrors.name && <div className="text-red-600 text-sm mt-1">{fieldErrors.name}</div>}
                </div>
                <div>
                  <input type="text" placeholder="Country/Region" className="border p-3 rounded w-full" required value={formData.country} onChange={e => setFormData(f => ({...f, country: e.target.value}))} />
                  {fieldErrors.country && <div className="text-red-600 text-sm mt-1">{fieldErrors.country}</div>}
                </div>
                <div className="md:col-span-2">
                  <input type="text" placeholder="Address Line 1" className="border p-3 rounded w-full" required value={formData.address1} onChange={e => setFormData(f => ({...f, address1: e.target.value}))} />
                  {fieldErrors.address1 && <div className="text-red-600 text-sm mt-1">{fieldErrors.address1}</div>}
                </div>
                <div className="md:col-span-2">
                  <input type="text" placeholder="Address Line 2 (optional)" className="border p-3 rounded w-full" value={formData.address2} onChange={e => setFormData(f => ({...f, address2: e.target.value}))} />
                </div>
                <div>
                  <input type="text" placeholder="City" className="border p-3 rounded w-full" required value={formData.city} onChange={e => setFormData(f => ({...f, city: e.target.value}))} />
                  {fieldErrors.city && <div className="text-red-600 text-sm mt-1">{fieldErrors.city}</div>}
                </div>
                <div>
                  <input type="text" placeholder="State/Province" className="border p-3 rounded w-full" required value={formData.state} onChange={e => setFormData(f => ({...f, state: e.target.value}))} />
                  {fieldErrors.state && <div className="text-red-600 text-sm mt-1">{fieldErrors.state}</div>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Postal/ZIP Code"
                    className="border p-3 rounded w-full"
                    required
                    value={formData.zip}
                    onChange={e => {
                      // Only allow digits
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData(f => ({ ...f, zip: value }));
                    }}
                  />
                  {fieldErrors.zip && <div className="text-red-600 text-sm mt-1">{fieldErrors.zip}</div>}
                </div>
              </div>
              <div className="mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Save this address to my account</span>
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <span>Express (2-3 days) - ₹199.00</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <span>Standard (5-7 days) - ₹99.00</span>
                </label>
              </div>
            </div>
            <div>
              <textarea placeholder="Order notes / instructions (optional)" className="border p-3 rounded w-full" rows={3} />
            </div>
            {/* Coupon input removed from left side, now on right */}
            <button
              type="button"
              className="w-full py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition"
              onClick={async () => {
                // Field-level validation
                const requiredFields: { key: keyof typeof formData; label: string }[] = [
                  { key: 'name', label: 'Full Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'country', label: 'Country/Region' },
                  { key: 'address1', label: 'Address Line 1' },
                  { key: 'city', label: 'City' },
                  { key: 'state', label: 'State/Province' },
                  { key: 'zip', label: 'Postal/ZIP Code' }
                ];
                let errors: { [key: string]: string } = {};
                for (const field of requiredFields) {
                  const value = formData[field.key];
                  if (!value || value.trim() === "") {
                    errors[field.key] = `Please enter ${field.label}`;
                  }
                }
                setFieldErrors(errors);
                if (Object.keys(errors).length > 0) return;
                // Load Razorpay script if not loaded
                if (!window.Razorpay) {
                  const script = document.createElement('script');
                  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                  script.async = true;
                  document.body.appendChild(script);
                  await new Promise(resolve => { script.onload = resolve; });
                }
                // Create order via backend (include shipping in amount)
                const res = await fetch('/api/razorpay-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    amount: subtotal + shipping + tax - discountAmount,
                    currency: 'INR',
                    receipt: `order_${Date.now()}`,
                  }),
                });
                const order = await res.json();
                if (!order.id) {
                  setFieldErrors({ general: 'Failed to create Razorpay order' });
                  return;
                }
                const options = {
                  key: 'rzp_test_RjmxgXfQRU1nog',
                  amount: order.amount,
                  currency: order.currency,
                  name: 'Luxxe Labels',
                  description: 'Order Payment',
                  order_id: order.id,
                  handler: async function (response: any) {
                    // Save order/payment to Firestore
                    try {
                      const { db } = await import("@/lib/firebaseClient");
                      const { collection, addDoc, Timestamp } = await import("firebase/firestore");
                      // Use user?.id or user?.email as fallback for userId
                      console.log('Saving order with userId:', user?.uid, user);
                      await addDoc(collection(db, "orders"), {
                        userId: user?.uid || null,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: {
                          country: formData.country,
                          address1: formData.address1,
                          address2: formData.address2,
                          city: formData.city,
                          state: formData.state,
                          zip: formData.zip,
                        },
                        items: items,
                        subtotal,
                        shipping,
                        shippingMethod,
                        tax,
                        total: subtotal + shipping + tax - discountAmount,
                        coupon: appliedCoupon?.code || null,
                        discount: discountAmount,
                        paymentId: response.razorpay_payment_id,
                        orderId: order.id,
                        createdAt: Timestamp.now(),
                      });
                      // Clear cart after order is placed
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("cart");
                      }
                      if (typeof window !== "undefined" && window.dispatchEvent) {
                        window.dispatchEvent(new Event("cartUpdated"));
                      }
                      // Redirect to confirmation page
                      router.replace("/order-confirmation?paymentId=" + response.razorpay_payment_id);
                    } catch (err) {
                      setFieldErrors({ general: 'Failed to save order. Please contact support.' });
                    }
                  // Firestore rules for orders collection (add to your Firestore rules):
                  // service cloud.firestore {
                  //   match /databases/{database}/documents {
                  //     match /orders/{orderId} {
                  //       allow create: if request.auth != null;
                  //       allow read: if request.auth != null && request.auth.uid == resource.data.userId;
                  //     }
                  //   }
                  // }
                  },
                  prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                  },
                  theme: { color: '#6366f1' },
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
              }}
            >
              Pay Now
            </button>
            {/* General error */}
            {fieldErrors.general && <div className="text-red-600 text-sm mt-4">{fieldErrors.general}</div>}
          </form>
          {/* Right: Order Summary */}
          <div className="col-span-1 bg-secondary/30 p-6 rounded-xl shadow-lg border border-border/30">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {/* Coupon code input on right */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Apply Coupon</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={handleCouponInput}
                  className="border p-2 rounded w-40"
                  disabled={couponApplied}
                />
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-primary text-white font-semibold"
                  onClick={handleApplyCoupon}
                >
                  {couponApplied ? "Remove" : "Apply"}
                </button>
                {couponApplied && (
                  <span className="ml-2 text-green-600 font-medium">Coupon applied!</span>
                )}
                {couponError && (
                  <span className="ml-2 text-red-600 font-medium">{couponError}</span>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {items.map((item, idx) => {
                // For buy_get, mark free items
                let freeLabel = "";
                if (couponApplied && appliedCoupon?.type === "buy_get") {
                  const key = item.id + '-' + item.variant;
                  if (freeItemsMap[key]) {
                    freeLabel = `Free`;
                  }
                }
                return (
                  <div key={item.id + '-' + item.variant + '-' + idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Image</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-muted-foreground text-sm">{item.variant}</div>
                      <div className="text-muted-foreground text-sm">Qty: {item.quantity} {freeLabel && <span className="text-green-600 font-bold ml-2">{freeLabel}</span>}</div>
                    </div>
                    <div className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            {/* Discount details */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
                {discountAmount > 0 && coupon && (
                <div className="flex justify-between text-lg text-green-700">
                  <span>
                    Discount ({(() => {
                      const found = activeCoupons.find(c => c.code.toLowerCase() === coupon.trim().toLowerCase());
                      if (!found) return "";
                      if (found?.type === "percent") return `${found.percent ?? 0}%`;
                      if (found?.type === "flat") return `Flat ₹${found.amount ?? 0}`;
                      if (found?.type === "buy_get") return `${found.code}`;
                      return found.code;
                    })()})
                  </span>
                  <span>-₹{discountAmount.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
                </div>
              )}
              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax</span>
                <span>₹{tax.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
              </div>
                {discountAmount > 0 && coupon && (
                <div className="text-green-700 text-sm mt-2">Coupon <span className="font-bold">{coupon}</span> applied!</div>
              )}
            </div>
            <Link href="/cart" className="block mt-6 text-primary underline">Back to cart</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
