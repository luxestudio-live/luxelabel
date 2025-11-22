"use client";
import AdminLayout from "../AdminLayout";
import Link from "next/link";
import { useState } from "react";

const dummyReturns = [
  {
    id: "R1001",
    orderId: "ORD1001",
    customer: "Jane Doe",
    reason: "Wrong size",
    status: "open",
    created: "2025-11-22",
  },
  {
    id: "R1002",
    orderId: "ORD1002",
    customer: "Rahul Singh",
    reason: "Damaged item",
    status: "resolved",
    created: "2025-11-21",
  },
];

export default function ReturnsPage() {
  const [filter, setFilter] = useState("");
  const filteredReturns = filter ? dummyReturns.filter(r => r.status === filter) : dummyReturns;
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Returns / Complaints</h1>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Return ID</th>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map(r => (
              <tr key={r.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-mono text-xs">{r.id}</td>
                <td className="p-4 font-mono text-xs">{r.orderId}</td>
                <td className="p-4">{r.customer}</td>
                <td className="p-4">{r.reason}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${r.status === "open" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{r.status}</span></td>
                <td className="p-4">{r.created}</td>
                <td className="p-4">
                  <Link href={`/admin/returns/${r.id}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
