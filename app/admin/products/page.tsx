
"use client";
import { useState } from "react";
import AdminLayout from "../AdminLayout";
import Link from "next/link";
// ...existing code...
const dummyProducts = [
  {
    name: "Luxury Silk Dress",
    sku: "LSK-001",
    price: 4999,
    stock: 12,
    category: "Dresses",
  },
  // ...existing code...
];
// ...existing code...
export default function ProductsPage() {
  const [filter, setFilter] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number|null>(null);
  const filteredProducts = filter ? dummyProducts.filter(p => p.category === filter) : dummyProducts;
  const handleDelete = (idx: number) => {
    setDeleteIdx(idx);
    setShowConfirm(true);
  };
  const confirmDelete = () => {
    // Dummy delete logic
    setShowConfirm(false);
    setDeleteIdx(null);
    // You can add actual delete logic here
  };
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-primary">Products</h1>
        <Link href="/admin/products/add" className="px-5 py-2 rounded-xl bg-primary text-white font-bold shadow hover:bg-blue-700 transition">+ Add Product</Link>
      </div>
      <div className="mb-6 flex gap-4 items-center">
        <select className="px-3 py-2 rounded border" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Dresses">Dresses</option>
          <option value="Accessories">Accessories</option>
          <option value="Jewelry">Jewelry</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow bg-white/90">
        <table className="min-w-full text-sm">
          <thead className="bg-linear-to-r from-blue-100 via-purple-100 to-pink-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">SKU</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, idx) => (
              <tr key={p.sku} className="border-b last:border-none hover:bg-blue-50/30">
                <td className="p-4 font-bold text-primary">{p.name}</td>
                <td className="p-4 font-mono text-xs">{p.sku}</td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 flex gap-2">
                  <Link href={`/admin/products/edit/${p.sku}`} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200">Edit</Link>
                  <button className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200" onClick={() => handleDelete(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-xl font-bold mb-4">Confirm Delete</div>
            <div className="mb-6">Are you sure you want to delete this product?</div>
            <div className="flex gap-4 justify-center">
              <button className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 transition" onClick={confirmDelete}>Delete</button>
              <button className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}