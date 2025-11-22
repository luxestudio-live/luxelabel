"use client";
import AdminLayout from "../../AdminLayout";
import { useState } from "react";

const dummySales = {
  revenue: 125000,
  orders: 320,
  aov: 390.62,
  topProducts: [
    { name: "Luxury Silk Dress", sold: 48 },
    { name: "Designer Handbag", sold: 32 },
    { name: "Gold Earrings", sold: 28 },
  ],
  topCategories: [
    { name: "Dresses", sold: 80 },
    { name: "Accessories", sold: 60 },
    { name: "Jewelry", sold: 50 },
  ],
};

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState({ from: "2025-11-01", to: "2025-11-22" });
  // Filtering logic can be added later
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-primary">Sales Report</h1>
        <div className="flex gap-2">
          <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 rounded border" />
          <span className="mx-2">to</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 rounded border" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">Revenue</div>
          <div className="text-3xl font-extrabold">₹{dummySales.revenue.toLocaleString()}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">Orders</div>
          <div className="text-3xl font-extrabold">{dummySales.orders}</div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6 text-center">
          <div className="text-lg font-bold text-primary mb-2">AOV</div>
          <div className="text-3xl font-extrabold">₹{dummySales.aov.toFixed(2)}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-4 text-primary">Top Products</div>
          <ul>
            {dummySales.topProducts.map(p => (
              <li key={p.name} className="mb-2 flex justify-between">
                <span>{p.name}</span>
                <span className="font-bold text-primary">{p.sold}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white/90 rounded-2xl shadow p-6">
          <div className="font-bold text-lg mb-4 text-primary">Top Categories</div>
          <ul>
            {dummySales.topCategories.map(c => (
              <li key={c.name} className="mb-2 flex justify-between">
                <span>{c.name}</span>
                <span className="font-bold text-primary">{c.sold}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
