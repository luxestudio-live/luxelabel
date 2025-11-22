"use client";
import AdminLayout from "../AdminLayout";
import { useState } from "react";

const dummyBanners = [
  {
    id: "B1",
    image: "/banner1.jpg",
    title: "Winter Sale",
    link: "/sale",
    start: "2025-11-01",
    end: "2025-12-01",
    status: "active",
  },
  {
    id: "B2",
    image: "/banner2.jpg",
    title: "New Arrivals",
    link: "/new",
    start: "2025-10-15",
    end: "2025-11-30",
    status: "inactive",
  },
];

export default function BannersPage() {
  const [filter, setFilter] = useState("");
  const filteredBanners = filter ? dummyBanners.filter(b => b.status === filter) : dummyBanners;
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Banners / Promotions</h1>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">+ Add Banner</button>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Link</th>
              <th className="p-4 text-left">Active Dates</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanners.map(b => (
              <tr key={b.id} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4"><img src={b.image} alt={b.title} className="w-24 h-12 object-cover rounded border" /></td>
                <td className="p-4 font-bold text-primary">{b.title}</td>
                <td className="p-4"><a href={b.link} className="text-blue-700 underline">{b.link}</a></td>
                <td className="p-4">{b.start} - {b.end}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${b.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{b.status}</span></td>
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
