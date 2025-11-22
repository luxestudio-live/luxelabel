"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function AccountDashboardPage() {
  // Dummy user and orders data
  const user = { name: "Jane Doe" };
  const orders = [
    { id: "ORD12345", date: "2025-11-10", status: "Shipped", total: "$120.00" },
    { id: "ORD12344", date: "2025-10-28", status: "Delivered", total: "$89.00" },
  ];
  const activeOrdersCount = orders.filter(o => o.status !== "Delivered").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        <div className="bg-white dark:bg-card p-8 rounded-xl shadow-lg border border-border/30 w-full mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Account Home</h1>
          <h2 className="text-xl font-semibold mb-6">Welcome, {user.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <Link href="/account/orders" className="block bg-secondary/30 p-6 rounded-xl shadow hover:bg-secondary/50 transition">
              <div className="font-bold text-lg mb-2">Orders</div>
              <div className="text-2xl font-extrabold text-primary">{activeOrdersCount}</div>
              <div className="text-muted-foreground text-sm">Active Orders</div>
            </Link>
            <Link href="/account/addresses" className="block bg-secondary/30 p-6 rounded-xl shadow hover:bg-secondary/50 transition">
              <div className="font-bold text-lg mb-2">Addresses</div>
              <div className="text-muted-foreground text-sm">Manage your shipping addresses</div>
            </Link>
            <Link href="/account/profile" className="block bg-secondary/30 p-6 rounded-xl shadow hover:bg-secondary/50 transition">
              <div className="font-bold text-lg mb-2">Profile/Settings</div>
              <div className="text-muted-foreground text-sm">Edit your personal info</div>
            </Link>
            <Link href="/account/wishlist" className="block bg-secondary/30 p-6 rounded-xl shadow hover:bg-secondary/50 transition">
              <div className="font-bold text-lg mb-2">Wishlist</div>
              <div className="text-muted-foreground text-sm">Your saved items</div>
            </Link>
          </div>
          <div className="mb-10">
            <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No recent orders found.</p>
            ) : (
              <table className="w-full text-left border rounded-xl overflow-hidden">
                <thead className="bg-secondary/20">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t">
                      <td className="p-3 font-mono">{order.id}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">{order.total}</td>
                      <td className="p-3">
                        <Link href={`/account/orders/${order.id}`} className="text-primary underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end">
            <button type="button" className="px-6 py-3 rounded bg-destructive text-white font-bold text-lg hover:bg-destructive/80 transition">Logout</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
