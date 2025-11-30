"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AccountDashboardPage() {
  // Fetch logged-in user and their orders from Firestore
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubscribeAuth: any;
    async function fetchUserAndOrders() {
      try {
        const { db, auth } = await import("@/lib/firebaseClient");
        const { collection, query, where, getDocs, doc, getDoc } = await import("firebase/firestore");
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setUser(null);
          setOrders([]);
          setLoading(false);
          return;
        }
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        let loadedUser = currentUser;
        if (userDoc.exists()) {
          loadedUser = { ...currentUser, ...userDoc.data() };
        }
        setUser(loadedUser);
        // Fetch orders for user
        const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => doc.data()));
      } catch (err) {
        setUser(null);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndOrders();
    import("@/lib/firebaseClient").then(({ auth }) => {
      unsubscribeAuth = auth.onAuthStateChanged(() => {
        fetchUserAndOrders();
      });
    });
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);
  const activeOrdersCount = orders.filter(o => o.status !== "Delivered").length;

  // Try to get name from user object, fallback to email or "User"
  let displayName = "User";
  if (user) {
    // Try to get name from user object, fallback to email or "User"
    displayName = user.name || user.displayName || user.email || "User";
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        <div className="bg-white dark:bg-card p-10 rounded-3xl shadow-2xl border border-border/30 w-full mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary tracking-tight">Account Home</h1>
          <h2 className="text-2xl font-semibold mb-10 text-gray-800">Welcome, {displayName}</h2>
          <div className="mb-12">
            <h3 className="font-bold text-2xl mb-6 text-primary">Your Orders</h3>
            {loading ? (
              <div className="text-muted-foreground text-lg">Loading orders...</div>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground text-lg">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead className="bg-gradient-to-r from-[#eef2ff] to-[#f8fafc]">
                    <tr className="rounded-xl">
                      <th className="p-4 font-semibold text-lg text-gray-700">Order ID</th>
                      <th className="p-4 font-semibold text-lg text-gray-700">Date</th>
                      <th className="p-4 font-semibold text-lg text-gray-700">Status</th>
                      <th className="p-4 font-semibold text-lg text-gray-700">Total</th>
                      <th className="p-4 font-semibold text-lg text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId} className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-150">
                        <td className="p-4 font-mono text-base text-primary/90">{order.orderId}</td>
                        <td className="p-4 text-base">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : "-"}</td>
                        <td className="p-4 text-base font-semibold text-green-600">{order.status || "Order Placed"}</td>
                        <td className="p-4 text-base font-bold text-gray-900">{String.fromCharCode(8377)}{order.total?.toLocaleString()}</td>
                        <td className="p-4">
                          <Link href={`/order-detail?id=${order.orderId}`} className="inline-block px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
