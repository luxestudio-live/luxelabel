"use client";
import Link from "next/link";
import AdminLayout from "../AdminLayout";
import { useState } from "react";
const dummyCategories = [
  { id: 1, name: "Dresses", parent: null, count: 12, status: "active" },
  { id: 2, name: "Bags", parent: null, count: 5, status: "active" },
  { id: 3, name: "Shirts", parent: null, count: 8, status: "active" },
];
export default function CategoriesPage() {
  const [form] = useState({
    name: "",
    desc: "",
    parent: "",
    image: "",
    seoTitle: "",
    seoDesc: "",
    status: "active",
  });
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Categories</h1>
      </div>
      {/* Category List */}
      <div className="mb-8 overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Parent</th>
              <th className="p-4 text-left">Product Count</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyCategories.map(c => (
              <tr key={c.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{c.name}</td>
                <td className="p-4">{c.parent ?? "-"}</td>
                <td className="p-4 font-semibold text-blue-700">{c.count}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Category Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/80 rounded-2xl shadow p-8">
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">Category Info</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Name" value={form.name} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Description" value={form.desc} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Parent" value={form.parent} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="Image/Icon" value={form.image} />
        </div>
        <div>
          <h2 className="font-bold text-lg mb-4 text-primary">SEO & Status</h2>
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="SEO Title" value={form.seoTitle} />
          <input className="mb-3 w-full px-4 py-2 rounded border" placeholder="SEO Description" value={form.seoDesc} />
          <select className="mb-3 w-full px-4 py-2 rounded border" value={form.status}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </form>
    </AdminLayout>
  );
}