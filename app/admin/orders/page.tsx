"use client";
import { useState } from "react";
import Link from "next/link";
import AdminLayout from "../AdminLayout";

const dummyOrders = [
  {
    id: "ORD1001",
    customer: { name: "Jane Doe", email: "jane@example.com" },
    date: "2025-11-21",
    total: 4999,
    payment: "Paid",
    shipping: "Shipped",
    channel: "Website",
  },
  {
    id: "ORD1002",
    customer: { name: "Rahul Singh", email: "rahul@example.com" },
    date: "2025-11-20",
    total: 7499,
    payment: "Pending",
    shipping: "Pending",
    channel: "Website",
  },
  {
    id: "ORD1003",
    customer: { name: "Amit Patel", email: "amit@example.com" },
    date: "2025-11-19",
    total: 2499,
    payment: "Refunded",
    shipping: "Cancelled",
    channel: "Instagram",
  },
];

const paymentStatusColors = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-red-100 text-red-700",
};
const shippingStatusColors = {
  Shipped: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [filter, setFilter] = useState({
    status: "",
    payment: "",
    channel: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const filteredOrders = dummyOrders.filter(o => {
    if (filter.status && o.shipping !== filter.status) return false;
    if (filter.payment && o.payment !== filter.payment) return false;
    if (filter.channel && o.channel !== filter.channel) return false;
    if (filter.search && !(o.id.toLowerCase().includes(filter.search.toLowerCase()) || o.customer.email.toLowerCase().includes(filter.search.toLowerCase()))) return false;
    if (filter.dateFrom && o.date < filter.dateFrom) return false;
    if (filter.dateTo && o.date > filter.dateTo) return false;
    return true;
  });
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Orders</h1>
      </div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white/80 rounded-2xl shadow p-4">
        <input type="date" className="px-3 py-2 rounded border" value={filter.dateFrom} onChange={e => setFilter(f => ({ ...f, dateFrom: e.target.value }))} />
        <input type="date" className="px-3 py-2 rounded border" value={filter.dateTo} onChange={e => setFilter(f => ({ ...f, dateTo: e.target.value }))} />
        <select className="px-3 py-2 rounded border" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Shipping Status</option>
          <option value="Shipped">Shipped</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select className="px-3 py-2 rounded border" value={filter.payment} onChange={e => setFilter(f => ({ ...f, payment: e.target.value }))}>
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select className="px-3 py-2 rounded border" value={filter.channel} onChange={e => setFilter(f => ({ ...f, channel: e.target.value }))}>
          <option value="">All Channels</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
        </select>
        <input type="text" className="px-3 py-2 rounded border w-40" placeholder="Search ID/Email" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
      </div>
      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Shipping</th>
              <th className="p-4 text-left">Channel</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-mono text-xs">{o.id}</td>
                <td className="p-4 font-bold text-primary">{o.customer.name}<br /><span className="text-xs text-muted-foreground">{o.customer.email}</span></td>
                <td className="p-4">{o.date}</td>
                <td className="p-4 font-semibold text-blue-700">₹{o.total}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${(paymentStatusColors as Record<string, string>)[o.payment]}`}>{o.payment}</span></td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${(shippingStatusColors as Record<string, string>)[o.shipping]}`}>{o.shipping}</span></td>
                <td className="p-4">{o.channel}</td>
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
