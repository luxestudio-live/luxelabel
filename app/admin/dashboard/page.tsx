"use client";




import dynamic from "next/dynamic";
import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

const KPI_CONFIG = [
  { label: "Total Sales (INR)", icon: "💰", color: "bg-linear-to-r from-green-400 to-blue-500" },
  { label: "Today's Sales (INR)", icon: "📈", color: "bg-linear-to-r from-blue-400 to-purple-500" },
  { label: "Orders (All)", icon: "🛒", color: "bg-linear-to-r from-yellow-400 to-pink-500" },
  { label: "Pending Orders", icon: "⏳", color: "bg-linear-to-r from-orange-400 to-red-500" },
  { label: "Completed Orders", icon: "✅", color: "bg-linear-to-r from-green-400 to-teal-500" },
  { label: "Refunds/Returns", icon: "↩️", color: "bg-linear-to-r from-pink-400 to-red-500" },
  { label: "Total Customers", icon: "👤", color: "bg-linear-to-r from-indigo-400 to-blue-500" },
  { label: "Top Product", icon: "⭐", color: "bg-linear-to-r from-yellow-400 to-orange-500" },
];

const FILTERS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last3Months", label: "Last 3 Months" },
  { key: "quarter", label: "This Quarter" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

const quickLinks = [
  { label: "Manage Orders", href: "/admin/orders" },
  { label: "Manage Products", href: "/admin/products" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings", href: "/admin/settings" },
];

const SalesChart = dynamic(() => import("./DashboardCharts").then(m => m.SalesChart), { ssr: false });
const OrdersChart = dynamic(() => import("./DashboardCharts").then(m => m.OrdersChart), { ssr: false });
const TrafficChart = dynamic(() => import("./DashboardCharts").then(m => m.TrafficChart), { ssr: false });

export default function AdminDashboard() {
  // Removed unused filter state
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  // Removed unused loading state

  useEffect(() => {
    async function fetchData() {
      try {
        const prodSnap = await getDocs(collection(db, "products"));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        const custSnap = await getDocs(collection(db, "users"));
        setCustomers(custSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchData();
  }, []);

  // KPIs
  const totalCustomers = customers.length;
  const topProduct = products.length > 0
    ? products.reduce((a, b) => (a.totalOrders || 0) > (b.totalOrders || 0) ? a : b, products[0]).name
    : "-";
  // Dummy for sales/orders, real for products/customers
  const KPIS = [
    "₹24,000", // Total Sales (dummy)
    "₹24,000", // Today's Sales (dummy)
    32,         // Orders (dummy)
    2,          // Pending Orders (dummy)
    30,         // Completed Orders (dummy)
    1,          // Refunds/Returns (dummy)
    totalCustomers, // Total Customers (live)
    topProduct      // Top Product (live)
  ].map((value, idx) => ({ ...KPI_CONFIG[idx], value }));

  // Low stock products (live)
  const lowStock = Array.isArray(products)
    ? products.filter(p => p.stockQty > 0 && p.stockQty < 20).map(p => ({ product: p.name, stock: p.stockQty }))
    : [];

  // Recent signups (last 3, live)
  const sortedSignups = Array.isArray(customers)
    ? [...customers].sort((a, b) => {
        // Sort by createdAt descending if available
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      })
    : [];
  const recentSignups = sortedSignups.slice(0, 3).map(u => ({ name: u.name || u.email || "User", date: u.createdAt || "-" }));

  // Other widgets remain dummy
  const latestOrders = [
    { id: "ORD1001", customer: "Jane Doe", total: "₹4,999", status: "Pending" },
    { id: "ORD1002", customer: "Rahul Singh", total: "₹7,499", status: "Completed" },
    { id: "ORD1003", customer: "Amit Patel", total: "₹2,499", status: "Refund" },
    { id: "ORD1004", customer: "Priya Sharma", total: "₹1,999", status: "Pending" },
  ];
  const pendingRefunds = [
    { id: "ORD1003", customer: "Amit Patel", amount: "₹2,499" },
  ];

  return (
    <AdminLayout>
      {/* Header removed, now only using AdminLayout's header */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        {/* KPIs */}
        <section className="mb-12 w-full flex flex-col items-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {KPIS.map(stat => (
              <div
                key={stat.label}
                className="flex items-center rounded-2xl shadow-xl p-6 border border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-white/90 dark:bg-card/90 backdrop-blur-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                style={{ minWidth: 0 }}
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-gray-100 via-blue-100 to-purple-100 text-2xl opacity-60 mr-6" style={{ lineHeight: 1 }}>{stat.icon}</span>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold text-muted-foreground mb-1 wrap-break-word" style={{ maxWidth: '140px' }}>{stat.label}</span>
                  <span className="text-3xl font-extrabold text-primary wrap-break-word" style={{ maxWidth: '160px' }}>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Charts */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl shadow-2xl p-8 border border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-white/95 dark:bg-card/95 backdrop-blur-xl flex flex-col items-center">
            <h2 className="font-bold text-xl mb-6 text-primary">Sales Over Time</h2>
            <div className="w-full h-56 flex items-center justify-center">
              <SalesChart />
            </div>
          </div>
          <div className="rounded-3xl shadow-2xl p-8 border border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-white/95 dark:bg-card/95 backdrop-blur-xl flex flex-col items-center">
            <h2 className="font-bold text-xl mb-6 text-primary">Orders Over Time</h2>
            <div className="w-full h-56 flex items-center justify-center">
              <OrdersChart />
            </div>
          </div>
          <div className="rounded-3xl shadow-2xl p-8 border border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-white/95 dark:bg-card/95 backdrop-blur-xl flex flex-col items-center">
            <h2 className="font-bold text-xl mb-6 text-primary">Traffic & Conversion</h2>
            <div className="w-full h-56 flex items-center justify-center">
              <TrafficChart />
            </div>
          </div>
        </section>
        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quickLinks.map(link => (
              <a key={link.label} href={link.href} className="flex items-center gap-4 bg-white/95 dark:bg-card/95 rounded-2xl shadow-xl p-6 border border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-lg font-semibold text-primary hover:bg-primary/10 hover:scale-[1.03] transition-all duration-200 group">
                <span className="text-2xl">
                  {link.label === "Manage Orders" && "📦"}
                  {link.label === "Manage Products" && "🛍️"}
                  {link.label === "Customers" && "👥"}
                  {link.label === "Settings" && "⚙️"}
                </span>
                <span className="group-hover:underline">{link.label}</span>
              </a>
            ))}
          </div>
        </section>
        {/* Widgets - New UI */}
        <section className="w-full py-8 px-2 rounded-3xl shadow-2xl mt-8">
          <div className="flex flex-col gap-10">
            {/* Latest Orders Carousel (dummy) */}
            <div>
              <h3 className="font-extrabold text-3xl mb-4 text-blue-700 drop-shadow flex items-center gap-2">Latest Orders <span className="text-lg">📝</span></h3>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {latestOrders.map(order => {
                  let badgeClass = "bg-yellow-600 text-white";
                  let badgeIcon = "⏳";
                  if (order.status === "Completed") { badgeClass = "bg-green-600 text-white"; badgeIcon = "✅"; }
                  else if (order.status === "Refund") { badgeClass = "bg-red-600 text-white"; badgeIcon = "↩️"; }
                  return (
                    <div key={order.id} className="min-w-[260px] max-w-xs rounded-2xl bg-black/60 border-l-8 border-blue-500 shadow-lg p-6 flex flex-col justify-between transition hover:scale-105 hover:shadow-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs bg-gray-800 text-white px-3 py-1 rounded-lg">{order.id}</span>
                        <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg font-bold ${badgeClass}`}>
                          <span className="text-base">{badgeIcon}</span> {order.status}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{order.customer}</div>
                      <div className="text-xl font-extrabold text-blue-300">{order.total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Low Stock Carousel (live) */}
            <div>
              <h3 className="font-extrabold text-3xl mb-4 text-red-700 drop-shadow flex items-center gap-2">Low Stock Alerts <span className="text-lg">⚠️</span></h3>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {lowStock.map(item => (
                  <div key={item.product} className="min-w-[220px] max-w-xs rounded-2xl bg-black/60 border-l-8 border-red-500 shadow-lg p-6 flex flex-col justify-between transition hover:scale-105 hover:shadow-2xl">
                    <div className="text-lg font-bold text-white mb-2">{item.product}</div>
                    <div className="text-xl font-extrabold text-red-400">{item.stock} left</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pending Refunds Carousel (dummy) */}
            <div>
              <h3 className="font-extrabold text-3xl mb-4 text-yellow-700 drop-shadow flex items-center gap-2">Pending Refunds/Returns <span className="text-lg">💸</span></h3>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {pendingRefunds.map(ref => (
                  <div key={ref.id} className="min-w-[220px] max-w-xs rounded-2xl bg-black/60 border-l-8 border-yellow-500 shadow-lg p-6 flex flex-col justify-between transition hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs bg-yellow-700 text-white px-3 py-1 rounded-lg">{ref.id}</span>
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{ref.customer}</div>
                    <div className="text-xl font-extrabold text-yellow-300">{ref.amount}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Signups Carousel (live) */}
            <div>
              <h3 className="font-extrabold text-3xl mb-4 text-purple-700 drop-shadow flex items-center gap-2">Recent Signups <span className="text-lg">🆕</span></h3>
              <div className="flex gap-6 overflow-x-auto pb-2">
                {recentSignups.map(user => (
                  <div key={user.name} className="min-w-[220px] max-w-xs rounded-2xl bg-black/60 border-l-8 border-purple-500 shadow-lg p-6 flex flex-col justify-between transition hover:scale-105 hover:shadow-2xl">
                    <div className="text-lg font-bold text-white mb-2">{user.name}</div>
                    <div className="text-base text-purple-300 font-semibold">{user.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

