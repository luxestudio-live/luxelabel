"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams ? searchParams.get("paymentId") : null;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = require('next/navigation').useRouter();
  useEffect(() => {
    async function fetchOrder() {
      if (!paymentId) {
        setError("No payment ID found.");
        setLoading(false);
        return;
      }
      try {
        const { db, auth } = await import("../../lib/firebaseClient");
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const q = query(collection(db, "orders"), where("paymentId", "==", paymentId));
        const snap = await getDocs(q);
        if (snap.empty) {
          setError("Order not found.");
        } else {
          const orderData = snap.docs[0].data();
          setOrder(orderData);
        }
      } catch (err: any) {
        if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
          setError("You do not have permission to view this order. Please make sure you are logged in as the correct user.");
        } else {
          setError("Failed to fetch order.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [paymentId]);

  let content;
  if (loading) {
    content = <div className="text-center text-lg">Loading...</div>;
  } else if (error) {
    content = <div className="text-center text-red-600 text-lg">{error}</div>;
  } else if (order) {
    content = (
      <>
        {/* ...existing code for order details, items, summary, etc... */}
        <div className="mb-6 text-center">
          <div className="text-green-600 text-xl font-semibold mb-2">Thank you for your purchase!</div>
          <div className="text-muted-foreground">Your order has been placed successfully.</div>
        </div>
        {/* ...existing code for order details, shipping address, items, summary, etc... */}
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">Order Details</div>
          <div className="mb-2">Status: <span className="font-semibold">{order.order_status || order.status || '-'}</span></div>
          <div className="mb-2">Courier Partner: <span className="font-semibold">{order.courier_partner || '-'}</span></div>
          <div className="mb-2">Tracking Number: <span className="font-semibold">{order.tracking_number || '-'}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ...existing code for order fields... */}
            <div>
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-mono">{order.orderId || order.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Payment ID</div>
              <div className="font-mono">{order.paymentId || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Order Date</div>
              <div>
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : order.created
                    ? (typeof order.created === "object" && typeof order.created.toLocaleString === "function"
                        ? order.created.toLocaleString()
                        : order.created)
                    : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customer Name</div>
              <div>{order.customer?.name || order.name || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Payment Method</div>
              <div>{order.paymentMethod || order.paymentStatus || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Order Status</div>
              <div>{order.order_status || order.status || 'Order Placed'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Courier Partner</div>
              <div>
                {order.order_status === 'Order Dispatched' && order.courier_partner
                  ? order.courier_partner
                  : <span className="text-muted-foreground">Details will be updated once order is dispatched</span>}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tracking Number</div>
              <div>
                {order.order_status === 'Order Dispatched' && order.tracking_number
                  ? order.tracking_number
                  : <span className="text-muted-foreground">Details will be updated once order is dispatched</span>}
              </div>
            </div>
          </div>
        </div>
        {/* ...existing code for shipping address, items, summary, etc... */}
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">Shipping Address</div>
          <div className="text-sm text-muted-foreground">{order.shippingMethod === "express" ? "Express (2-3 days)" : "Standard (5-7 days)"} - ₹{order.shipping}</div>
          <div className="mt-2">
            <div>{order.address?.name}</div>
            <div>{order.address?.address1}</div>
            {order.address?.address2 && <div>{order.address.address2}</div>}
            <div>{order.address?.city}, {order.address?.state} {order.address?.zip}</div>
            <div>{order.address?.country}</div>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">Items</div>
          <div className="divide-y">
            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
              <button
                key={String(item.id || '') + '-' + String(item.variant || '') + '-' + String(item.sku || '') + '-' + idx}
                className="flex items-center gap-4 py-3 w-full text-left hover:bg-secondary/30 transition-all"
                type="button"
                onClick={async () => {
                  try {
                    const { db } = await import("../../lib/firebaseClient");
                    const { doc, getDoc } = await import("firebase/firestore");
                    const productRef = doc(db, "products", item.id);
                    const productSnap = await getDoc(productRef);
                    if (productSnap.exists()) {
                      router.push(`/product/${item.id}`);
                    } else {
                      alert("Product not found.");
                    }
                  } catch {
                    alert("Failed to fetch product.");
                  }
                }}
                aria-label={`View product ${item.name}`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Image</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-muted-foreground text-sm">{item.variant}</div>
                  <div className="text-muted-foreground text-sm">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold">₹{typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toLocaleString() : '-'}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && order.coupon && (
              <div className="flex justify-between text-lg text-green-700">
                <span>Discount ({order.coupon})</span>
                <span>-₹{order.discount?.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
              </div>
            )}
            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>₹{order.shipping?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax</span>
              <span>₹{order.tax?.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2">
              <span>Total Paid</span>
              <span>₹{order.total?.toLocaleString(undefined, {maximumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/" className="px-6 py-3 rounded bg-primary text-white font-bold text-lg hover:bg-primary/90 transition">Continue Shopping</Link>
        </div>
      </>
    );
  } else {
    content = null;
  }
  return content;
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto bg-white dark:bg-card p-8 rounded-xl shadow-lg border border-border/30">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary text-center">Order Confirmation</h1>
          <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
            <OrderConfirmationContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

