"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../AdminLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const paymentStatusColors = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-red-100 text-red-700",
};
const shippingStatusColors = {
  Placed: "bg-gray-100 text-gray-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Preparing: "bg-yellow-200 text-yellow-900",
  Prepared: "bg-yellow-300 text-yellow-900",
  ReadyToDispatch: "bg-blue-200 text-blue-900",
  Dispatched: "bg-orange-100 text-orange-700",
  Delivered: "bg-green-200 text-green-900",
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "orders"));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter.status && o.status !== filter.status) return false;
    if (filter.payment && !(
      o.razorpay?.method === filter.payment ||
      o.razorpay?.payment_method === filter.payment ||
      o.paymentMethod === filter.payment ||
      o.paymentStatus === filter.payment
    )) return false;
    if (filter.channel && !(
      o.channel === filter.channel ||
      o.source === filter.channel
    )) return false;
    if (filter.search && !(o.id.toLowerCase().includes(filter.search.toLowerCase()) || (o.customer?.email || "").toLowerCase().includes(filter.search.toLowerCase()))) return false;
    if (filter.dateFrom && o.createdAt?.toDate && o.createdAt.toDate() < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && o.createdAt?.toDate && o.createdAt.toDate() > new Date(filter.dateTo)) return false;
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
          <option value="">All Status</option>
          <option value="Placed">Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
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
        {loading ? (
          <div className="p-8 text-center">Loading orders...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer Info</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Payment Method</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Courier</th>
                <th className="p-4 text-left">Tracking</th>
                <th className="p-4 text-left">Channel</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id} className="border-b last:border-none hover:bg-blue-50/30">
                  <td className="p-4 font-mono text-xs">{o.id}</td>
                  <td className="p-4 font-bold text-primary">
                    {/* Customer Name on one line */}
                    <div>{o.customer?.fullName || o.customer?.name || o.name || '-'}</div>
                    {/* Other details on separate lines */}
                    {o.customer?.email && (
                      <div className="text-xs text-muted-foreground">{o.customer.email}</div>
                    )}
                    {o.customer?.phone && (
                      <div className="text-xs text-muted-foreground">{o.customer.phone}</div>
                    )}
                    {o.customer?.address && (
                      <div className="text-xs text-muted-foreground">{o.customer.address}</div>
                    )}
                  </td>
                  <td className="p-4">{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : "-"}</td>
                  <td className="p-4 font-semibold text-blue-700">{o.total}</td>
                  <td className="p-4">
                    {/* Show payment method from Razorpay if available, fallback to paymentMethod or paymentStatus */}
                    <span className="font-semibold">{o.razorpay?.method || o.razorpay?.payment_method || o.paymentMethod || o.paymentStatus || '-'}</span>
                  </td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${(shippingStatusColors as Record<string, string>)[o.order_status || o.status]}`}>{o.order_status || o.status || '-'}</span></td>
                  <td className="p-4">{o.courier_partner || '-'}</td>
                  <td className="p-4">{o.tracking_number || '-'}</td>
                  <td className="p-4">{o.channel}</td>
                  <td className="p-4">
                    <Link href={`/admin/orders/${o.id}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
