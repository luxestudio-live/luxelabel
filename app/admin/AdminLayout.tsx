"use client";

import Link from "next/link";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Banners", href: "/admin/banners" },
  { label: "Coupons", href: "/admin/coupons" },
  { label: "Returns", href: "/admin/returns" },
  { label: "Sales Report", href: "/admin/reports/sales" },
  { label: "Inventory Report", href: "/admin/reports/inventory" },
  { label: "Customer Report", href: "/admin/reports/customers" },
];

const headerFilters = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last3Months", label: "Last 3 Months" },
  { key: "quarter", label: "This Quarter" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [filter, setFilter] = useState("today");
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-100">
      {/* Fixed Sidebar */}
      <nav className="fixed left-0 top-0 h-screen w-56 bg-white/80 shadow-lg rounded-r-3xl flex flex-col py-8 px-4 gap-6 z-50">
        <h2 className="text-xl font-extrabold text-primary mb-6">Admin Panel</h2>
        {sidebarLinks.map(link => (
          <Link key={link.label} href={link.href} className="font-semibold text-gray-700 hover:text-primary">
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 ml-56" style={{ width: 'calc(100% - 14rem)', overflowX: 'hidden' }}>
        <div className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-4 md:px-8 py-6 flex flex-wrap items-center justify-between shadow-2xl backdrop-blur-lg rounded-b-2xl w-full">
          <div className="flex items-center gap-4 min-w-0">
            <img src="/icon.svg" alt="Logo" className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30 shrink-0" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow truncate">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <select
              className="bg-white/20 text-white font-semibold px-3 md:px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              {headerFilters.map(f => (
                <option key={f.key} value={f.key} className="text-black">{f.label}</option>
              ))}
            </select>
            <span className="text-base font-medium whitespace-nowrap">Welcome, Admin</span>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" className="w-9 h-9 rounded-full border-2 border-white/40 shadow shrink-0" />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="ml-56 pt-8 px-8 pb-10">
        {children}
      </div>
    </div>
  );
}
