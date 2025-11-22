
"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState } from "react";

const dummyOrders = [
  { id: "ORD1001", date: "2025-11-01", status: "Shipped", total: 9999, items: 3 },
  { id: "ORD1002", date: "2025-10-20", status: "Delivered", total: 7499, items: 2 },
  { id: "ORD1003", date: "2025-09-15", status: "Pending", total: 4999, items: 1 },
  { id: "ORD1004", date: "2025-08-30", status: "Cancelled", total: 0, items: 2 },
];
const statusOptions = ["All", "Active", "Completed", "Cancelled"];

export default function OrdersPage() {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = dummyOrders.filter(order => {
    if (status !== "All") {
      if (status === "Active" && order.status !== "Pending" && order.status !== "Shipped") return false;
      if (status === "Completed" && order.status !== "Delivered") return false;
      if (status === "Cancelled" && order.status !== "Cancelled") return false;
    }
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Order History</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border p-3 rounded w-full md:w-1/3"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border p-3 rounded w-full md:w-1/4"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg border border-border/30">
          <table className="w-full text-left">
            <thead className="bg-secondary/20">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total (INR)</th>
                <th className="p-3">Items</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No orders found.</td></tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3 font-mono">{order.id}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">₹{order.total.toLocaleString()}</td>
                    <td className="p-3">{order.items} items</td>
                    <td className="p-3">
                      <Link href={`/order-detail?id=${order.id}`} className="text-primary underline">View details</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
