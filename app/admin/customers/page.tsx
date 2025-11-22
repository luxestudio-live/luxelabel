"use client";
import AdminLayout from "../AdminLayout";
import Link from "next/link";
import { useState } from "react";

const dummyCustomers = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+91-9876543210",
    totalOrders: 5,
    totalSpent: 24999,
    lastOrder: "2025-11-21",
    status: "active",
    tags: ["VIP", "Newsletter"],
    lastLogin: "2025-11-22",
    consent: true,
  },
  {
    id: "2",
    name: "Rahul Singh",
    email: "rahul@example.com",
    phone: "+91-9876501234",
    totalOrders: 2,
    totalSpent: 7999,
    lastOrder: "2025-11-20",
    status: "active",
    tags: ["Regular"],
    lastLogin: "2025-11-21",
    consent: false,
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91-9876512345",
    totalOrders: 1,
    totalSpent: 2499,
    lastOrder: "2025-11-19",
    status: "inactive",
    tags: ["Newsletter"],
    lastLogin: "2025-11-19",
    consent: true,
  },
];

export default function CustomersPage() {
  const [filter, setFilter] = useState({
    segment: "",
    status: "",
    highValue: false,
    lastActivity: "",
    search: "",
  });
  const filteredCustomers = dummyCustomers.filter(c => {
    if (filter.segment && !c.tags.includes(filter.segment)) return false;
    if (filter.status && c.status !== filter.status) return false;
    if (filter.highValue && c.totalSpent < 20000) return false;
    if (filter.lastActivity && c.lastLogin !== filter.lastActivity) return false;
    if (filter.search && !(c.name.toLowerCase().includes(filter.search.toLowerCase()) || c.email.toLowerCase().includes(filter.search.toLowerCase()))) return false;
    return true;
  });
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Customers</h1>
      </div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-white/80 rounded-2xl shadow p-4">
        <select className="px-3 py-2 rounded border" value={filter.segment} onChange={e => setFilter(f => ({ ...f, segment: e.target.value }))}>
          <option value="">All Segments</option>
          <option value="VIP">VIP</option>
          <option value="Newsletter">Newsletter</option>
          <option value="Regular">Regular</option>
        </select>
        <select className="px-3 py-2 rounded border" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filter.highValue} onChange={e => setFilter(f => ({ ...f, highValue: e.target.checked }))} /> High Value
        </label>
        <input type="date" className="px-3 py-2 rounded border" value={filter.lastActivity} onChange={e => setFilter(f => ({ ...f, lastActivity: e.target.value }))} />
        <input type="text" className="px-3 py-2 rounded border w-40" placeholder="Search name/email" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
      </div>
      {/* Customers Table */}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Total Orders</th>
              <th className="p-4 text-left">Total Spent</th>
              <th className="p-4 text-left">Last Order</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{c.name}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.phone}</td>
                <td className="p-4">{c.totalOrders}</td>
                <td className="p-4 font-semibold text-blue-700">₹{c.totalSpent}</td>
                <td className="p-4">{c.lastOrder}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span></td>
                <td className="p-4">
                  <Link href={`/admin/customers/${c.id}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
