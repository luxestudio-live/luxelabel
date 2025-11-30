
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";



import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get("id") : null;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("No order ID found.");
        setLoading(false);
        return;
      }
      try {
        const { db, auth } = await import("@/lib/firebaseClient");
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const user = auth.currentUser;
        const q = query(collection(db, "orders"), where("orderId", "==", orderId), where("userId", "==", user?.uid));
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
    }
    fetchOrder();
  }, [orderId]);

  let content;
  if (loading) {
    content = <div className="text-center text-lg">Loading...</div>;
  } else if (error) {
    content = <div className="text-center text-red-600 text-lg">{error}</div>;
  } else if (order) {
    content = (
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="font-semibold text-lg">Order ID: <span className="font-mono">{order.orderId}</span></div>
            <div className="text-muted-foreground">Placed on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "-"}</div>
            <div className="mt-2"><span className="font-semibold">Status:</span> {order.status || "-"}</div>
            <div><span className="font-semibold">Payment Status:</span> Paid</div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Add tracking and invoice actions if available */}
          </div>
        </div>
        {/* Shipping Info */}
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
        {/* Items List */}
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
        {/* Cost Breakdown */}
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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <a href="/account-dashboard" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">← Back to Orders</a>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Order Details</h1>
        </div>
        {content}
        <div className="flex justify-start mt-8">
          <a href="/account-dashboard" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">← Back to Orders</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
