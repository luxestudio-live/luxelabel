"use client";
import AdminLayout from "../AdminLayout";
import { useState } from "react";

const dummyCoupons = [
  {
    id: "C1",
    code: "WINTER20",
    type: "percentage",
    value: 20,
    minOrder: 1000,
    start: "2025-11-01",
    end: "2025-12-01",
    usage: 50,
    limit: 100,
    status: "active",
  },
  {
    id: "C2",
    code: "FLAT500",
    type: "fixed",
    value: 500,
    minOrder: 3000,
    start: "2025-10-15",
    end: "2025-11-30",
    usage: 10,
    limit: 20,
    status: "inactive",
  },
];

export default function CouponsPage() {
  const [filter, setFilter] = useState("");
  const filteredCoupons = filter ? dummyCoupons.filter(c => c.status === filter) : dummyCoupons;
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Coupons / Discounts</h1>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">+ Add Coupon</button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Value</th>
              <th className="p-4 text-left">Min Order</th>
              <th className="p-4 text-left">Valid Dates</th>
              <th className="p-4 text-left">Usage</th>
              <th className="p-4 text-left">Limit</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(c => (
              <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{c.code}</td>
                <td className="p-4">{c.type}</td>
                <td className="p-4">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-4">₹{c.minOrder}</td>
                <td className="p-4">{c.start} - {c.end}</td>
                <td className="p-4">{c.usage}</td>
                <td className="p-4">{c.limit}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span></td>
                <td className="p-4">
                  <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">Edit</button>
                  <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
