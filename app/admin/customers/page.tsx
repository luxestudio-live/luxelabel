"use client";
import AdminLayout from "../AdminLayout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

// Fetch customers from Firestore
function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);
  return { customers, loading };
}

export default function CustomersPage() {
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState({
    segment: "",
    status: "",
    highValue: false,
    lastActivity: "",
    search: "",
  });
  const { customers, loading } = useCustomers();
  const [localCustomers, setLocalCustomers] = useState<any[]>([]);
  useEffect(() => {
    setLocalCustomers(customers);
  }, [customers]);

  async function handleDeleteCustomer(id: string) {
    setStatus("");
    // Find customer object by id
    const customer = localCustomers.find(c => c.id === id);
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this customer? This will remove their account permanently.")) {
      return;
    }
    // Check for auth UID
    if (!customer || !customer.uid) {
      setStatus("Cannot delete: Auth UID missing in Firestore. Please add 'uid' field to user document.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    try {
      // Call API route to delete user from Auth and Firestore
      const res = await fetch("/api/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: customer.uid })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      setStatus("Customer deleted successfully.");
      setLocalCustomers(customers => customers.filter(c => c.id !== id));
    } catch (err: any) {
      setStatus(err?.message || "Failed to delete customer.");
    }
    setTimeout(() => setStatus(""), 2000);
  }
  const filteredCustomers = localCustomers.filter(c => {
    if (filter.segment && !(c.tags || []).includes(filter.segment)) return false;
    if (filter.status && c.status !== filter.status) return false;
    if (filter.highValue && c.totalSpent < 20000) return false;
    if (filter.lastActivity && c.lastLogin !== filter.lastActivity) return false;
    if (filter.search && !(c.name?.toLowerCase().includes(filter.search.toLowerCase()) || c.email?.toLowerCase().includes(filter.search.toLowerCase()))) return false;
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
      {status && (
        <div className="mb-4 text-center font-bold text-blue-600">{status}</div>
      )}
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        {loading ? (
          <div className="p-8 text-center text-blue-600 font-bold">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-red-600 font-bold">No customers found.</div>
        ) : (
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
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                  <td className="p-4 font-bold text-primary">{c.name || "NA"}</td>
                  <td className="p-4">{c.email || "NA"}</td>
                  <td className="p-4">{c.phone || "NA"}</td>
                  <td className="p-4">{c.totalOrders !== undefined ? c.totalOrders : "NA"}</td>
                  <td className="p-4 font-semibold text-blue-700">{c.totalSpent !== undefined ? `₹${c.totalSpent}` : "NA"}</td>
                  <td className="p-4">{c.lastOrder || "NA"}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status || "NA"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
