
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";



import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


import { Suspense } from "react";

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get("id") : null;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsub: any;
    async function fetchOrderWithAuth() {
      if (!orderId) {
        setError("No order ID found.");
        setLoading(false);
        return;
      }
      try {
        const { db, auth } = await import("@/lib/firebaseClient");
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        unsub = auth.onAuthStateChanged(async (user) => {
          if (!user) {
            setError("You must be logged in to view this order.");
            setLoading(false);
            return;
          }
          try {
            const q = query(collection(db, "orders"), where("orderId", "==", orderId), where("userId", "==", user.uid));
            const snap = await getDocs(q);
            if (snap.empty) {
              setError("Order not found or you do not have permission to view this order.");
            } else {
              setOrder(snap.docs[0].data());
            }
          } catch (err: any) {
            setError("Failed to fetch order.");
          } finally {
            setLoading(false);
          }
        });
      } catch (err: any) {
        setError("Failed to fetch order.");
        setLoading(false);
      }
    }
    fetchOrderWithAuth();
    return () => { if (unsub) unsub(); };
  }, [orderId]);

  let content;
  if (loading) {
    content = <div className="text-center text-lg">Loading...</div>;
  } else if (error) {
    content = <div className="text-center text-red-600 text-lg">{error}</div>;
  } else if (order) {
    content = (
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30 space-y-8">
        {/* ...existing code for order details, items, summary, etc... */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="font-semibold text-lg">Order ID: <span className="font-mono">{order.orderId}</span></div>
            <div className="text-muted-foreground">Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "-"}</div>
            <div className="mt-2">
              <span className="font-semibold">Status:</span>
              <span className={`ml-2 px-3 py-1 rounded-lg font-bold text-white ${order.order_status === 'Delivered' ? 'bg-green-600' : order.order_status === 'Shipped' || order.order_status === 'Dispatched' ? 'bg-blue-600' : order.order_status === 'Cancelled' ? 'bg-red-600' : 'bg-yellow-500'}`}>
                {typeof order.order_status === 'string' && order.order_status.trim() !== '' ? order.order_status : 'Yet to ship'}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Courier Partner:</span>
              <span className="ml-2 px-2 py-1 rounded bg-secondary/30 font-semibold">
                {typeof order.courier_partner === 'string' && order.courier_partner.trim() !== '' ? order.courier_partner : 'Yet to ship'}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Tracking Number:</span>
              <span className="ml-2 px-2 py-1 rounded bg-secondary/30 font-mono">
                {typeof order.tracking_number === 'string' && order.tracking_number.trim() !== '' ? order.tracking_number : 'Yet to ship'}
              </span>
            </div>
            <div><span className="font-semibold">Payment Status:</span> Paid</div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Add tracking and invoice actions if available */}
          </div>
        </div>
        {/* ...existing code for shipping info, items, cost breakdown... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Shipping Info</h2>
            <div><span className="font-semibold">Recipient:</span> {order.name}</div>
            <div><span className="font-semibold">Address:</span> {order.address?.address1} {order.address?.address2}, {order.address?.city}, {order.address?.state}, {order.address?.zip}</div>
            <div><span className="font-semibold">Phone:</span> {order.phone}</div>
            <div><span className="font-semibold">Email:</span> {order.email}</div>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Payment Info</h2>
            <div><span className="font-semibold">Method:</span> Razorpay</div>
            <div><span className="font-semibold">Transaction ID:</span> {order.paymentId}</div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Items</h2>
          <table className="w-full text-left">
            <thead className="bg-secondary/20">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Variant</th>
                <th className="p-3">Price (INR)</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id + '-' + item.variant} className="border-b">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="object-cover w-full h-full" /> : <span className="text-xs text-muted-foreground">Image</span>}
                    </div>
                    <span className="font-semibold">{item.name}</span>
                  </td>
                  <td className="p-3">{item.variant}</td>
                  <td className="p-3">₹{item.price.toLocaleString()}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3 font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-secondary/10 p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Cost Breakdown</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-₹{order.discount?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.tax?.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Grand Total</span><span>₹{order.total?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    );
  }
  return content;
}

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <a href="/account-dashboard" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">← Back to Orders</a>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Order Details</h1>
        </div>
        <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
          <OrderDetailContent />
        </Suspense>
        <div className="flex justify-start mt-8">
          <a href="/account-dashboard" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">← Back to Orders</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
