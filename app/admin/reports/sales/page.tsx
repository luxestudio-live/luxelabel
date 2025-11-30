"use client";
import AdminLayout from "../../AdminLayout";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

function aggregateSales(orders) {
  let revenue = 0;
  let ordersCount = orders.length;
  let productMap = {};
  let categoryMap = {};
  orders.forEach(order => {
    revenue += order.total || 0;
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const prodName = item.product || item.name || item.sku || item.id || "Unknown";
        productMap[prodName] = (productMap[prodName] || 0) + (item.qty || item.quantity || 1);
      });
    }
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, sold]) => ({ name, sold }));
  return {
    revenue,
    orders: ordersCount,
    aov: ordersCount ? revenue / ordersCount : 0,
    topProducts,
  };
}

export default function SalesReportPage() {
  // Helper to format date as yyyy-mm-dd
  function formatDate(d) {
    return d.toISOString().slice(0, 10);
  }
  const today = formatDate(new Date());
  const [dateRange, setDateRange] = useState({ from: "", to: today });
  const [quickFilter, setQuickFilter] = useState("All");
  const [sales, setSales] = useState({ revenue: 0, orders: 0, aov: 0, topProducts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let from = dateRange.from;
    let to = dateRange.to;
    if (quickFilter === "Day") {
      from = today;
      to = today;
    } else if (quickFilter === "Week") {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      from = formatDate(weekAgo);
      to = today;
    } else if (quickFilter === "Month") {
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      from = formatDate(monthAgo);
      to = today;
    } else if (quickFilter === "All") {
      from = "";
      to = today;
    }
    setDateRange({ from, to });
  }, [quickFilter]);

  useEffect(() => {
    async function fetchSales() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "orders"));
        let orders = snap.docs.map(doc => doc.data());
        // Filter by date range
        if (dateRange.from || dateRange.to) {
          orders = orders.filter(o => {
            let d = null;
            if (o.createdAt?.toDate) {
              d = o.createdAt.toDate();
            } else if (typeof o.createdAt === "string" || o.createdAt instanceof Date) {
              d = new Date(o.createdAt);
            }
            // If no date, include the order (assume valid)
            if (!d) return true;
            if (dateRange.from && d < new Date(dateRange.from)) return false;
            if (dateRange.to && d > new Date(dateRange.to)) return false;
            return true;
          });
        }
        setSales(aggregateSales(orders));
      } catch {
        setSales({ revenue: 0, orders: 0, aov: 0, topProducts: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [dateRange]);

  return (
    <AdminLayout>
      <div className="relative mb-10">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl blur-lg opacity-60 -z-10" />
        <div className="flex flex-col md:flex-row items-center justify-between py-8 px-4 md:px-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight drop-shadow-lg">Sales Report</h1>
          <div className="flex gap-2 items-center mt-4 md:mt-0">
            {["Day", "Week", "Month", "All"].map(f => (
              <button
                key={f}
                className={`px-4 py-2 rounded-full font-semibold shadow transition-all border-2 border-transparent ${quickFilter === f ? "bg-blue-700 text-white border-blue-700 scale-105" : "bg-white text-blue-700 hover:bg-blue-50"}`}
                onClick={() => setQuickFilter(f)}
              >{f}</button>
            ))}
            <span className="mx-2 font-bold text-primary">|</span>
            <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="px-3 py-2 rounded-xl border shadow" />
            <span className="mx-2 font-bold text-primary">to</span>
            <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="px-3 py-2 rounded-xl border shadow" />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="p-8 text-center text-base font-semibold text-primary/70 animate-pulse">Loading sales report...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] rounded-2xl shadow-xl p-8 border border-[#e0e7ff] text-center flex flex-col items-center">
              <div className="mb-2"><span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V7a5 5 0 1110 0v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></div>
              <div className="text-base font-extrabold text-primary mb-1 tracking-tight">Revenue</div>
              <div className="text-2xl font-extrabold text-blue-700">₹{sales.revenue.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] rounded-2xl shadow-xl p-8 border border-[#e0e7ff] text-center flex flex-col items-center">
              <div className="mb-2"><span className="inline-block bg-purple-100 text-purple-700 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="4" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></div>
              <div className="text-base font-extrabold text-primary mb-1 tracking-tight">Orders</div>
              <div className="text-2xl font-extrabold text-purple-700">{sales.orders}</div>
            </div>
            <div className="bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] rounded-2xl shadow-xl p-8 border border-[#e0e7ff] text-center flex flex-col items-center">
              <div className="mb-2"><span className="inline-block bg-pink-100 text-pink-700 rounded-full p-2"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="4" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span></div>
              <div className="text-base font-extrabold text-primary mb-1 tracking-tight">AOV</div>
              <div className="text-2xl font-extrabold text-pink-700">₹{sales.aov.toFixed(2)}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0fdfa] rounded-2xl shadow-xl p-8 border border-[#e0e7ff]">
              <div className="font-extrabold text-lg mb-4 text-primary tracking-tight">Top Products</div>
              <ul className="divide-y divide-[#e0e7ff]">
                {sales.topProducts.length === 0 ? (
                  <li className="py-6 text-center text-muted-foreground text-base">No products found in this range.</li>
                ) : (
                  sales.topProducts.map((p, idx) => (
                    <li key={p.name} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-blue-200 to-purple-200 text-center font-bold text-base text-primary shadow flex items-center justify-center">{idx + 1}</span>
                        <span className="font-semibold text-base text-primary">{p.name}</span>
                      </div>
                      <span className="font-bold text-lg text-blue-700">{p.sold}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
