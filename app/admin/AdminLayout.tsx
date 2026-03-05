"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";

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

export default function AdminLayout({ children }) {
  const [filter, setFilter] = useState("today");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Client-side admin session enforcement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      setLoggedIn(isLoggedIn);
      // If not logged in and not on login page, redirect to login
      if (!isLoggedIn && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    }
  }, [pathname, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (pathname === "/admin/login") return;
      if (user) return;

      if (typeof window !== "undefined") {
        localStorage.removeItem("adminLoggedIn");
        document.cookie = "adminLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      setLoggedIn(false);
      router.replace("/admin/login");
    });

    return () => unsubscribe();
  }, [pathname, router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminLoggedIn");
      document.cookie = "adminLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      signOut(auth).catch(() => {});
      setLoggedIn(false);
      router.replace("/admin/login");
    }
  }

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
        {loggedIn && (
          <button
            onClick={handleLogout}
            className="mt-8 py-2 px-4 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
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
